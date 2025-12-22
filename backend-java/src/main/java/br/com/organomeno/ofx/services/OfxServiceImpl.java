package br.com.organomeno.ofx.services;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.ofx.entity.ArquivoOfx;
import br.com.organomeno.ofx.entity.ArquivoOfxTransacao;
import br.com.organomeno.ofx.leitura.LeitorDeOfx;
import br.com.organomeno.ofx.repository.ArquivoOfxRepository;
import br.com.organomeno.ofx.repository.ArquivoOfxTransacaoRepository;
import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import com.webcohesion.ofx4j.io.OFXParseException;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;


import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class OfxServiceImpl implements OfxService {

    @Inject
    DespesasRepository despesasRepository;
    @Inject
    ReceitasRepository receitasRepository;
    @Inject
    DespesasMapper despesasMapper;
    @Inject
    ReceitasMapper receitasMapper;
    @Inject
    ArquivoOfxRepository arquivoOfxRepository;
    @Inject
    ArquivoOfxTransacaoRepository arquivoOfxTransacaoRepository;
    @Inject
    ContaRepository contaRepository;

    @Override
    @Transactional
    public Response fazerLeituraDeOFX(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException {
        try {
            if (documentDetailsRequests.getIdConta() == null) {
                throw new IllegalArgumentException("A conta é obrigatória para importação do arquivo OFX.");
            }

            Conta conta = contaRepository.findById(documentDetailsRequests.getIdConta());
            if (conta == null) {
                throw new IllegalArgumentException("Conta não encontrada.");
            }

            LeitorDeOfx leitorDeOFX = new LeitorDeOfx();
            LeitorDeOfx.ResultadoImportacao resultado = leitorDeOFX.importarOFX(documentDetailsRequests);

            List<DespesasDTO> despesasDTOList = resultado.getListaDespesas();
            List<ReceitasDTO> receitasDTOList = resultado.getListaReceita();

            List<DespesasDTO> despesasParaPersistir = despesasDTOList.stream()
                    .filter(despesa -> despesasRepository.findByFitId(despesa.getFitId()) == null)
                    .collect(Collectors.toList());

            List<ReceitasDTO> receitasParaPersistir = receitasDTOList.stream()
                    .filter(receita -> receitasRepository.findByFitId(receita.getFitId()) == null)
                    .collect(Collectors.toList());

            List<Despesas> despesas = despesasMapper.toListEntity(despesasParaPersistir);
            despesasRepository.persist(despesas);

            List<Receitas> receitas = receitasMapper.toEntityList(receitasParaPersistir);
            receitasRepository.persist(receitas);

            // Salvar informações do arquivo importado
            ArquivoOfx arquivoOfx = new ArquivoOfx();
            arquivoOfx.setNomeArquivo(documentDetailsRequests.getFileUpload().get(0).fileName());
            arquivoOfx.setDataImportacao(LocalDateTime.now());
            arquivoOfx.setConta(conta);
            arquivoOfx.setQuantidadeReceitas(receitasParaPersistir.size());
            arquivoOfx.setQuantidadeDespesas(despesasParaPersistir.size());
            arquivoOfxRepository.persist(arquivoOfx);
            arquivoOfxRepository.flush();

            // Salvar relacionamentos com as transações (fitIds)
            for (ReceitasDTO receita : receitasParaPersistir) {
                ArquivoOfxTransacao transacao = new ArquivoOfxTransacao();
                transacao.setArquivoOfx(arquivoOfx);
                transacao.setFitId(receita.getFitId());
                transacao.setTipoTransacao("RECEITA");
                arquivoOfxTransacaoRepository.persist(transacao);
            }

            for (DespesasDTO despesa : despesasParaPersistir) {
                ArquivoOfxTransacao transacao = new ArquivoOfxTransacao();
                transacao.setArquivoOfx(arquivoOfx);
                transacao.setFitId(despesa.getFitId());
                transacao.setTipoTransacao("DESPESA");
                arquivoOfxTransacaoRepository.persist(transacao);
            }

            return Response.ok(Json.encode("Receitas e Despesas foram inseridas com sucesso")).build();
        }catch (Exception e){
            throw new OFXParseException(e.getMessage());
        }
    }
}
