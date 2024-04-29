package br.com.organomeno.ofx.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.ofx.leitura.LeitorDeOfx;
import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import br.com.organomeno.receitas.entity.Receitas;
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

            List<Despesas> despesas = despesasMapper.toListEntity(resultado.getListaDespesas());
            despesasRepository.persist(despesas);

            List<Receitas> receitas = receitasMapper.toEntityList(resultado.getListaReceita());
            receitasRepository.persist(receitas);

            return Response.ok(Json.encode("Receitas e Despesas foram inseridas com sucesso")).build();
        }catch (Exception e){
            throw new OFXParseException(e.getMessage());
        }
    }
}
