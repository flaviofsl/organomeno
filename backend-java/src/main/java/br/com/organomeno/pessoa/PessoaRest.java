package br.com.organomeno.pessoa;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/pessoas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PessoaRest {

    @Inject
    PessoaService pessoaService;

    @GET
    @Path("/")
    public Response listarPessoas() {
        return Response.ok(pessoaService.listarPessoas()).build();
    }

    @POST
    @Path("/")
    public Response criarPessoa(PessoaDTO pessoaDTO) {
        try {
            PessoaDTO criada = pessoaService.criarPessoa(pessoaDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }

    @GET
    @Path("/dependencias")
    public Response listarDependencias() {
        return Response.ok(pessoaService.listarDependencias()).build();
    }

    @GET
    @Path("/{id}/dependencias")
    public Response listarDependenciasPorResponsavel(@PathParam("id") Long id) {
        return Response.ok(pessoaService.listarDependenciasPorResponsavel(id)).build();
    }

    @POST
    @Path("/dependencias")
    public Response criarDependencia(DependenciaDTO dependenciaDTO) {
        try {
            DependenciaDTO criada = pessoaService.criarDependencia(dependenciaDTO);
            return Response.status(Response.Status.CREATED).entity(criada).build();
        } catch (IllegalArgumentException e) {
            throw new WebApplicationException(e.getMessage(), Response.Status.BAD_REQUEST);
        }
    }
}
