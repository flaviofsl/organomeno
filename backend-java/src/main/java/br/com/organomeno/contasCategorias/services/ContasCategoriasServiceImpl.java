package br.com.organomeno.contasCategorias.services;

import br.com.organomeno.contasCategorias.entity.ContasCategorias;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasMapper;
import br.com.organomeno.contasCategorias.repository.ContasCategoriasRepository;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;
@ApplicationScoped
public class ContasCategoriasServiceImpl implements ContasCategoriasService {

    @Inject
    ContasCategoriasRepository contasCategoriasRepository;
    @Inject
    ContasCategoriasMapper contasCategoriasMapper;
    @Override
    public List<ContasCategorias> buscarTodasCategorias() {
        return contasCategoriasRepository.findAll().list();
    }
    @Override
    public ContasCategorias buscarCategoriaPorId(Integer id) {
        return contasCategoriasRepository.findById(id);
    }
    @Override
    public Response excluirCategoriaPorID(Integer id) {
        contasCategoriasRepository.deleteById(id);
        return Response.ok(Json.encode("Categoria Excluida!")).build();
    }
    @Override
    @Transactional
    public Response inserirCategoria(ContasCategoriasDTO contasCategoriasDTO) {
        contasCategoriasRepository.persist(contasCategoriasMapper.toEntity(contasCategoriasDTO));
        return Response.ok(Json.encode("Categoria Inserida!")).build();
    }
}
