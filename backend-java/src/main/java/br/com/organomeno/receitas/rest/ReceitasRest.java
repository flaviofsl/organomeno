package br.com.organomeno.receitas.rest;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import br.com.organomeno.receitas.services.ReceitasService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/receitas")
public class ReceitasRest {

    @Inject
    ReceitasService receitasService;

    @GET
    @Path("/")
    public Response filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO){
        return receitasService.filtrarReceitas(receitasFiltroDTO);
    }

    @POST
    @Path("/")
    public Response inserirReceita(ReceitasDTO receitasDTO){
        try {
            receitasService.inserirReceita(receitasDTO);
            return Response.ok().build();
        } catch (Exception e) {
            throw new WebApplicationException(e, Response.Status.BAD_REQUEST);
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
