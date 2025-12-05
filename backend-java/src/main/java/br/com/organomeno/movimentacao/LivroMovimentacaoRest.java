package br.com.organomeno.movimentacao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

@Path("/movimentacoes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LivroMovimentacaoRest {

    @Inject
    LivroMovimentacaoService movimentacaoService;

    @GET
    @Path("/")
    public Response listarMovimentacoes() {
        return Response.ok(movimentacaoService.listarMovimentacoes()).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarMovimentacaoPorId(@PathParam("id") Long id) {
        try {
            LivroMovimentacaoDTO movimentacao = movimentacaoService.buscarMovimentacaoPorId(id);
            return Response.ok(movimentacao).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @POST
    @Path("/")
    public Response criarMovimentacao(LivroMovimentacaoDTO movimentacaoDTO) {
        try {
            LivroMovimentacaoDTO criada = movimentacaoService.criarMovimentacao(movimentacaoDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizarMovimentacao(@PathParam("id") Long id, LivroMovimentacaoDTO movimentacaoDTO) {
        try {
            LivroMovimentacaoDTO atualizada = movimentacaoService.atualizarMovimentacao(id, movimentacaoDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }
}

