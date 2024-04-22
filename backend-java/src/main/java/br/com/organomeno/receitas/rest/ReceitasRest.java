package br.com.organomeno.receitas.rest;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import br.com.organomeno.receitas.services.ReceitasService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

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
        return receitasService.inserirReceita(receitasDTO);
    }
}
