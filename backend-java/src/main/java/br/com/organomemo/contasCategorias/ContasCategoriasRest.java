package br.com.organomemo.contasCategorias;

import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/categorias")
public class ContasCategoriasRest {
    @Inject
    ContasCategoriasService contasCategoriasService;

    @GET
    @Path("/")
    public List<ContasCategorias> buscarTodasCategorias(){
        return contasCategoriasService.buscarTodasCategorias();
    }
    @GET
    @Path("/{id}")
    public ContasCategorias buscarCategoriaPorId(@PathParam("id") Integer id){
        return contasCategoriasService.buscarCategoriaPorId(id);
    }
    @DELETE
    @Path("/{id}")
    public Response excluirCategoria(@PathParam("id")Integer id){
        contasCategoriasService.excluirCategoriaPorID(id);
        return Response.ok(Json.encode("Categoria Excluida!!")).build();
    }
    @PUT
    @Path("/")
    public Response inserirCategoria(ContasCategorias contasCategoriasDTO){
        contasCategoriasService.inserirCategoria(contasCategoriasDTO);
        return Response.ok(Json.encode("Categoria inserida!!")).build();
    }


}
