package br.com.organomeno.receitas.services;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
public class ReceitasServiceImpl implements ReceitasService{

    @Inject
    ReceitasRepository receitasRepository;
    @Inject
    ReceitasMapper receitasMapper;

    @Override
    public Response filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO) {
        List<ReceitasDTO> receitas = receitasMapper.toDTOList(receitasRepository.filtrarReceitas(receitasFiltroDTO));
        return Response.ok(receitas).build();
    }

    @Override
    @Transactional
    public Response inserirReceita(ReceitasDTO receitasDTO) {
        receitasRepository.persist(receitasMapper.toEntity(receitasDTO));
        return Response.ok(Json.encode("Receita inserida com sucesso")).build();
    }

    @Override
    public Response inserirNotaFiscal(List<ReceitasDTO> receitasDTO) {
        receitasRepository.persist(receitasMapper.toEntityList(receitasDTO));
        return Response.ok().build();
    }
}
