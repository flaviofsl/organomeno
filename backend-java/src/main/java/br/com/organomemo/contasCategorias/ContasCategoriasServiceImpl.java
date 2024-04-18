package br.com.organomemo.contasCategorias;

import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.util.List;
@ApplicationScoped
public class ContasCategoriasServiceImpl implements ContasCategoriasService{

    @Inject
    ContasCategoriasRepository contasCategoriasRepository;

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
    public Response inserirCategoria(ContasCategorias contasCategoriasDTO) {
        contasCategoriasRepository.persist(contasCategoriasDTO);
        return Response.ok(Json.encode("Categoria Inserida!")).build();
    }
}
