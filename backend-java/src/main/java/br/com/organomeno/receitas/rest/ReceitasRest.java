package br.com.organomeno.receitas.rest;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import br.com.organomeno.receitas.services.ReceitasService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

import java.util.List;

@Path("/receitas")
public class ReceitasRest {

    @Inject
    ReceitasService receitasService;

    @GET
    @Path("/todos")
    public List<ReceitasDTO> buscarTodasAsReceitas(){
        return receitasService.buscarTodasAsReceitas();
    }

    @GET
    @Path("/{id}")
    public ReceitasDTO buscarReceitaPorId(@PathParam("id") Integer id){
        return receitasService.buscarReceitaPorId(id);
    }

    @GET
    @Path("/")
    public Response filtrarReceitas(@BeanParam ReceitasFiltroDTO receitasFiltroDTO){
        return receitasService.filtrarReceitas(receitasFiltroDTO);
    }

    @POST
    @Path("/")
    public Response inserirReceita(ReceitasDTO receitasDTO){
        try {
            Response response = receitasService.inserirReceita(receitasDTO);
            return response;
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        } catch (Exception e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }

    }

    @PUT
    @Path("/{id}")
    public Response atualizarReceita(@PathParam("id") Integer id, ReceitasDTO receitaDTO) {
        try {
            ReceitasDTO atualizada = receitasService.atualizarReceita(id, receitaDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        } catch (Exception e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @PUT
    @Path("/vincular-nota")
    public Response vincularNotaFiscal(ReceitasDTO receitasDTO){
        try {
            receitasService.inserirNotaFiscal(receitasDTO);
            return Response.ok("Nota Fiscal Vinculada").build();
        }catch (Exception e){
            throw new WebApplicationException(e, Response.Status.INTERNAL_SERVER_ERROR);
        }
    }
}
