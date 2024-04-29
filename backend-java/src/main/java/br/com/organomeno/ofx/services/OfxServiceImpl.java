package br.com.organomeno.ofx.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.ofx.leitura.LeitorDeOfx;
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

    @Override
    @Transactional
    public Response fazerLeituraDeOFX(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException {
        try {
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

            return Response.ok(Json.encode("Receitas e Despesas foram inseridas com sucesso")).build();
        }catch (Exception e){
            throw new OFXParseException(e.getMessage());
        }
    }
}
