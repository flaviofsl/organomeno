package br.com.organomeno.ofx.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.ofx.leitura.LeitorDeOFX;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import net.sf.ofx4j.io.OFXParseException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@ApplicationScoped
public class OFXServiceImpl implements OFXService{

    @Inject
    DespesasRepository despesasRepository;
    @Inject
    ReceitasRepository receitasRepository;
    @Inject
    DespesasMapper despesasMapper;
    @Inject
    ReceitasMapper receitasMapper;

    @Override
    public Response fazerLeituraDeOFX(InputStream inputStreamOFX) throws IOException, OFXParseException {
        try {
            LeitorDeOFX leitorDeOFX = new LeitorDeOFX();
            LeitorDeOFX.ResultadoImportacao resultado = leitorDeOFX.importarCartaoCredito(inputStreamOFX);

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
