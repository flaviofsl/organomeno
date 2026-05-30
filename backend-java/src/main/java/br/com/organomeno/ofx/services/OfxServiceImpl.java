package br.com.organomeno.ofx.services;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.movimentacao.LivroMovimentacao;
import br.com.organomeno.movimentacao.LivroMovimentacaoRepository;
import br.com.organomeno.ofx.entity.ArquivoOfx;
import br.com.organomeno.ofx.entity.ArquivoOfxTransacao;
import br.com.organomeno.ofx.entity.PreviewOfxDTO;
import br.com.organomeno.ofx.entity.ResultadoImportacaoOfxDTO;
import br.com.organomeno.ofx.entity.TransacaoOfxPreviewDTO;
import br.com.organomeno.ofx.leitura.LeitorDeOfx;
import br.com.organomeno.ofx.repository.ArquivoOfxRepository;
import br.com.organomeno.ofx.repository.ArquivoOfxTransacaoRepository;
import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import com.webcohesion.ofx4j.io.OFXParseException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

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
    @Inject
    LivroMovimentacaoRepository movimentacaoRepository;

    @Override
    public PreviewOfxDTO previewOfx(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException {
        validarRequest(documentDetailsRequests);

        LeitorDeOfx leitorDeOfx = new LeitorDeOfx();
        LeitorDeOfx.ResultadoImportacao resultado = leitorDeOfx.importarOFX(documentDetailsRequests);

        return toPreviewDTO(documentDetailsRequests.getFileUpload().get(0).fileName(), resultado);
    }

    @Override
    @Transactional
    public ResultadoImportacaoOfxDTO importarOfx(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException {
        Conta conta = validarRequest(documentDetailsRequests);

        LeitorDeOfx leitorDeOfx = new LeitorDeOfx();
        LeitorDeOfx.ResultadoImportacao resultado = leitorDeOfx.importarOFX(documentDetailsRequests);

        List<DespesasDTO> despesasParaPersistir = new ArrayList<>(resultado.getListaDespesas());
        List<ReceitasDTO> receitasParaPersistir = new ArrayList<>(resultado.getListaReceita());

        List<Despesas> despesas = despesasMapper.toListEntity(despesasParaPersistir);
        despesasRepository.persist(despesas);

        List<Receitas> receitas = receitasMapper.toEntityList(receitasParaPersistir);
        receitasRepository.persist(receitas);

        ArquivoOfx arquivoOfx = new ArquivoOfx();
        arquivoOfx.setNomeArquivo(documentDetailsRequests.getFileUpload().get(0).fileName());
        arquivoOfx.setDataImportacao(LocalDateTime.now());
        arquivoOfx.setConta(conta);
        arquivoOfx.setQuantidadeReceitas(receitasParaPersistir.size());
        arquivoOfx.setQuantidadeDespesas(despesasParaPersistir.size());
        arquivoOfxRepository.persist(arquivoOfx);
        arquivoOfxRepository.flush();

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

        gravarNoLivroDeMovimentacao(despesas, receitas, conta);

        return new ResultadoImportacaoOfxDTO(
                arquivoOfx.getId(),
                arquivoOfx.getNomeArquivo(),
                receitasParaPersistir.size(),
                despesasParaPersistir.size(),
                "Receitas e despesas importadas com sucesso."
        );
    }

    private Conta validarRequest(MulitipleDocumentDetailsRequest documentDetailsRequests) {
        if (documentDetailsRequests.getFileUpload() == null || documentDetailsRequests.getFileUpload().isEmpty()) {
            throw new IllegalArgumentException("O arquivo OFX é obrigatório.");
        }

        if (documentDetailsRequests.getIdConta() == null) {
            throw new IllegalArgumentException("A conta é obrigatória para importação do arquivo OFX.");
        }

        Conta conta = contaRepository.findById(documentDetailsRequests.getIdConta());
        if (conta == null) {
            throw new IllegalArgumentException("Conta não encontrada.");
        }

        return conta;
    }

    private PreviewOfxDTO toPreviewDTO(String nomeArquivo, LeitorDeOfx.ResultadoImportacao resultado) {
        List<TransacaoOfxPreviewDTO> transacoes = new ArrayList<>();

        for (ReceitasDTO receita : resultado.getListaReceita()) {
            transacoes.add(new TransacaoOfxPreviewDTO(
                    receita.getFitId(),
                    receita.getDescricao(),
                    receita.getValorBruto(),
                    receita.getDataCadastro(),
                    "RECEITA",
                    receita.getIdCategoria()
            ));
        }

        for (DespesasDTO despesa : resultado.getListaDespesas()) {
            transacoes.add(new TransacaoOfxPreviewDTO(
                    despesa.getFitId(),
                    despesa.getDescricao(),
                    despesa.getValorBruto(),
                    despesa.getDataCadastro(),
                    "DESPESA",
                    despesa.getIdCategoria()
            ));
        }

        transacoes.sort(Comparator.comparing(
                TransacaoOfxPreviewDTO::getData,
                Comparator.nullsLast(Comparator.reverseOrder())
        ));

        return new PreviewOfxDTO(
                nomeArquivo,
                transacoes,
                resultado.getListaReceita().size(),
                resultado.getListaDespesas().size()
        );
    }

    private void gravarNoLivroDeMovimentacao(List<Despesas> despesas, List<Receitas> receitas, Conta conta) {
        for (Despesas despesa : despesas) {
            LivroMovimentacao movimentacao = new LivroMovimentacao();
            movimentacao.setConta(conta);
            movimentacao.setDataMovimentacao(despesa.getDataCadastro());
            movimentacao.setDescricao(despesa.getDescricao());
            movimentacao.setTipoMovimentacao("SAIDA");
            movimentacao.setValor(BigDecimal.valueOf(despesa.getValorBruto()));
            movimentacaoRepository.persist(movimentacao);
        }

        for (Receitas receita : receitas) {
            LivroMovimentacao movimentacao = new LivroMovimentacao();
            movimentacao.setConta(conta);
            movimentacao.setDataMovimentacao(receita.getDataCadastro());
            movimentacao.setDescricao(receita.getDescricao());
            movimentacao.setTipoMovimentacao("ENTRADA");
            movimentacao.setValor(BigDecimal.valueOf(receita.getValorBruto()));
            movimentacaoRepository.persist(movimentacao);
        }
    }
}
