package br.com.organomeno.membro;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/membros")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MembroFamiliaRest {

    @Inject
    MembroFamiliaService membroFamiliaService;

    @GET
    public Response listar(@QueryParam("idGrupo") Long idGrupo) {
        if (idGrupo == null)
            return Response.status(Response.Status.BAD_REQUEST).entity("idGrupo é obrigatório").build();
        return Response.ok(membroFamiliaService.listarPorGrupo(idGrupo)).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        try {
            return Response.ok(membroFamiliaService.buscarPorId(id)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }

    @POST
    public Response criar(MembroFamiliaDTO dto) {
        try {
            return Response.status(Response.Status.CREATED)
                    .entity(membroFamiliaService.criar(dto)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizar(@PathParam("id") Long id, MembroFamiliaDTO dto) {
        try {
            return Response.ok(membroFamiliaService.atualizar(id, dto)).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response desativar(@PathParam("id") Long id) {
        try {
            membroFamiliaService.desativar(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
        }
    }
}
