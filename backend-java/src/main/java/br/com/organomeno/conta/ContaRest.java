package br.com.organomeno.conta;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

@Path("/contas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContaRest {

    @Inject
    ContaService contaService;

    @GET
    @Path("/")
    public Response listarContas() {
        return Response.ok(contaService.listarContas()).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarContaPorId(@PathParam("id") Long id) {
        try {
            ContaDTO conta = contaService.buscarContaPorId(id);
            return Response.ok(conta).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @POST
    @Path("/")
    public Response criarConta(ContaDTO contaDTO) {
        try {
            ContaDTO criada = contaService.criarConta(contaDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizarConta(@PathParam("id") Long id, ContaDTO contaDTO) {
        try {
            ContaDTO atualizada = contaService.atualizarConta(id, contaDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }
}

