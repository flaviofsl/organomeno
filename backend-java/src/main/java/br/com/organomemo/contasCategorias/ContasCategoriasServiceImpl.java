package br.com.organomemo.contasCategorias;

import com.fasterxml.jackson.core.JsonEncoding;
import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import java.util.List;

public class ContasCategoriasServiceImpl implements ContasCategoriasService{

    @Inject
    ContasCategoriasRepository contasCategoriasRepository;

    @Override
    public List<ContasCategoriasDTO> buscarTodasCategorias() {
        return contasCategoriasRepository.findAll().list();
    }
    @Override
    public ContasCategoriasDTO buscarCategoriaPorId(Integer id) {
        return contasCategoriasRepository.findById(id);
    }
    @Override
    public Response excluirCategoriaPorID(Integer id) {
        contasCategoriasRepository.deleteById(id);
        return Response.ok(Json.encode("Categoria Excluida!")).build();
    }
    @Override
    public Response inserirCategoria(ContasCategoriasDTO contasCategoriasDTO) {
        contasCategoriasRepository.persist(contasCategoriasDTO);
        return Response.ok(Json.encode("Categoria Inserida!")).build();
    }
}
