package br.com.organomeno.contasCategorias.rest;

import br.com.organomeno.contasCategorias.entity.ContasCategorias;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.contasCategorias.services.ContasCategoriasService;
import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
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
    @POST
    @Path("/")
    public Response inserirCategoria(ContasCategoriasDTO contasCategoriasDTO){
        contasCategoriasService.inserirCategoria(contasCategoriasDTO);
        return Response.ok(Json.encode("Categoria inserida!!")).build();
    }


}
