package br.com.organomeno.transferencias;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

@Path("/transferencias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TransferenciaRest {

    @Inject
    TransferenciaService transferenciaService;

    @GET
    @Path("/")
    public Response listarTransferencias() {
        return Response.ok(transferenciaService.listarTransferencias()).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarTransferenciaPorId(@PathParam("id") Long id) {
        try {
            TransferenciaDTO transferencia = transferenciaService.buscarTransferenciaPorId(id);
            return Response.ok(transferencia).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @POST
    @Path("/")
    public Response criarTransferencia(TransferenciaDTO transferenciaDTO) {
        try {
            TransferenciaDTO criada = transferenciaService.criarTransferencia(transferenciaDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizarTransferencia(@PathParam("id") Long id, TransferenciaDTO transferenciaDTO) {
        try {
            TransferenciaDTO atualizada = transferenciaService.atualizarTransferencia(id, transferenciaDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deletarTransferencia(@PathParam("id") Long id) {
        try {
            transferenciaService.deletarTransferencia(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @GET
    @Path("/por-conta-origem/{idContaOrigem}")
    public Response listarTransferenciasPorContaOrigem(@PathParam("idContaOrigem") Long idContaOrigem) {
        try {
            return Response.ok(transferenciaService.listarTransferenciasPorContaOrigem(idContaOrigem)).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @GET
    @Path("/por-conta-destino/{idContaDestino}")
    public Response listarTransferenciasPorContaDestino(@PathParam("idContaDestino") Long idContaDestino) {
        try {
            return Response.ok(transferenciaService.listarTransferenciasPorContaDestino(idContaDestino)).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @GET
    @Path("/por-conta/{idConta}")
    public Response listarTransferenciasPorConta(@PathParam("idConta") Long idConta) {
        try {
            return Response.ok(transferenciaService.listarTransferenciasPorConta(idConta)).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }
}



