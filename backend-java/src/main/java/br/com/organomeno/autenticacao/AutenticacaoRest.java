package br.com.organomeno.autenticacao;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AutenticacaoRest {

    @Inject
    AutenticacaoService autenticacaoService;

    @POST
    @Path("/register")
    public Response cadastrar(CadastroUsuarioDTO dto) {
        try {
            UsuarioDTO criado = autenticacaoService.cadastrar(dto);
            return Response.status(Response.Status.CREATED).entity(criado).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErroDTO(e.getMessage())).build();
        }
    }

    @POST
    @Path("/login")
    public Response login(LoginDTO dto) {
        try {
            TokenAcessoDTO token = autenticacaoService.login(dto);
            return Response.ok(token).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ErroDTO(e.getMessage())).build();
        }
    }

    @POST
    @Path("/forgot-password")
    public Response solicitarRecuperacao(@QueryParam("email") String email) {
        autenticacaoService.solicitarRecuperacaoSenha(email);
        return Response.ok(new ErroDTO("Se o email estiver cadastrado, você receberá as instruções.")).build();
    }

    @POST
    @Path("/reset-password")
    public Response redefinirSenha(RedefinirSenhaDTO dto) {
        try {
            autenticacaoService.redefinirSenha(dto.getToken(), dto.getNovaSenha());
            return Response.ok(new ErroDTO("Senha redefinida com sucesso.")).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErroDTO(e.getMessage())).build();
        }
    }

    // DTO interno apenas para mensagens
    public static class ErroDTO {
        private String mensagem;
        public ErroDTO(String mensagem) { this.mensagem = mensagem; }
        public String getMensagem() { return mensagem; }
    }
}
