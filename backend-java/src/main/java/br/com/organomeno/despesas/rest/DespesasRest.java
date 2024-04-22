package br.com.organomeno.despesas.rest;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.despesas.services.DespesasService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/despesas")
public class DespesasRest {
    @Inject
    DespesasService despesasService;
    @GET
    @Path("/")
    public List<DespesasDTO> buscarTodasAsDespesas(){
        return despesasService.buscarTodasAsDespesas();
    }
    @GET
    @Path("/{id}")
    public DespesasDTO buscarDespesaPorId(@PathParam("id") Integer id){
        return despesasService.buscarDespesaPorId(id);
    }
    @GET
    public List<Despesas> filtrarDespesas(@BeanParam DespesasFiltroDTO despesasFiltroDTO){
        return despesasService.filtrarDespesas(despesasFiltroDTO);
    }


}
