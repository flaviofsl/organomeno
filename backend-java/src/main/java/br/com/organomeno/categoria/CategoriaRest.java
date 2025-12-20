package br.com.organomeno.categoria;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.WebApplicationException;

@Path("/categorias")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CategoriaRest {

    @Inject
    CategoriaService categoriaService;

    @GET
    @Path("/")
    public Response listarCategorias() {
        return Response.ok(categoriaService.listarCategorias()).build();
    }

    @GET
    @Path("/{id}")
    public Response buscarCategoriaPorId(@PathParam("id") Long id) {
        try {
            CategoriaDTO categoria = categoriaService.buscarCategoriaPorId(id);
            return Response.ok(categoria).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }

    @POST
    @Path("/")
    public Response criarCategoria(CategoriaDTO categoriaDTO) {
        try {
            CategoriaDTO criada = categoriaService.criarCategoria(categoriaDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @PUT
    @Path("/{id}")
    public Response atualizarCategoria(@PathParam("id") Long id, CategoriaDTO categoriaDTO) {
        try {
            CategoriaDTO atualizada = categoriaService.atualizarCategoria(id, categoriaDTO);
            return Response.ok(atualizada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @DELETE
    @Path("/{id}")
    public Response deletarCategoria(@PathParam("id") Long id) {
        try {
            categoriaService.deletarCategoria(id);
            return Response.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.NOT_FOUND);
        }
    }
}

