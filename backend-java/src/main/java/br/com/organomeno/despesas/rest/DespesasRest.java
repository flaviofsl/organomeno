package br.com.organomeno.despesas.rest;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.despesas.services.DespesasService;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;
import net.bytebuddy.implementation.bytecode.Throw;

import java.util.List;


@Path("/despesas")
public class DespesasRest {

    @Inject
    DespesasService despesasService;

    @GET
    @Path("/todos")
    public List<DespesasDTO> buscarTodasAsDespesas(){
        return despesasService.buscarTodasAsDespesas();
    }

    @GET
    @Path("/{id}")
    public DespesasDTO buscarDespesaPorId(@PathParam("id") Integer id){
        return despesasService.buscarDespesaPorId(id);
    }

    @GET
    @Path("/")
    public Response filtrarDespesas(@BeanParam DespesasFiltroDTO despesasFiltroDTO){
        List<DespesasDTO> despesas = despesasService.filtrarDespesas(despesasFiltroDTO);
        return Response.ok(despesas).build();
    }

    @POST
    @Path("/")
    public Response inserirDespesa(DespesasDTO despesa){
        try{
            Response response = despesasService.inserirDespesa(despesa);
            return response;
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        } catch (Exception e){
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }

    }

    @PUT
    @Path("/vincular-nota")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response vincularNotaFiscal(DespesasDTO despesasDTO){
        try {
            despesasService.vincularNotaFiscal(despesasDTO);
            return Response.ok(Json.encode("Nota Fiscal Vinculada com Sucesso")).build();
        } catch (Exception e) {
            throw e;
        }

    }

    @PUT
    @Path("/{id}")
    public Response atualizarDespesa(@PathParam("id") Integer id, DespesasDTO despesaDTO) {
        try {
            DespesasDTO atualizada = despesasService.atualizarDespesa(id, despesaDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        } catch (Exception e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }
}
