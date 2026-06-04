package br.com.organomeno.lancamento;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;

@Path("/lancamentos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LancamentoRest {

    @Inject
    LancamentoService lancamentoService;

    @GET
    public Response listar(
            @QueryParam("idGrupo") Long idGrupo,
            @QueryParam("tipo") String tipo,
            @QueryParam("inicio") String inicio,
            @QueryParam("fim") String fim) {
        if (idGrupo == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("idGrupo é obrigatório").build();
        }
        if (tipo != null && !tipo.isBlank()) {
            return Response.ok(lancamentoService.listarPorGrupoETipo(idGrupo, tipo)).build();
        }
        if (inicio != null && fim != null) {
            return Response.ok(lancamentoService.listarPorGrupoEPeriodo(
                    idGrupo, LocalDate.parse(inicio), LocalDate.parse(fim))).build();
        }
        return Response.ok(lancamentoService.listarPorGrupo(idGrupo)).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        try {
            return Response.ok(lancamentoService.buscarPorId(id)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response criar(LancamentoDTO dto) {
        try {
            return Response.status(Response.Status.CREATED)
                    .entity(lancamentoService.criar(dto)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, LancamentoDTO dto) {
        try {
            return Response.ok(lancamentoService.atualizar(id, dto)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deletar(@PathParam("id") Long id) {
        try {
            lancamentoService.deletar(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }
}
