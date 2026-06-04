package br.com.organomeno.autenticacao;

/**
 * DTO retornado após login bem-sucedido.
 */
public class TokenAcessoDTO {

    private String token;
    private String tipo = "Bearer";
    private UsuarioDTO usuario;

    public TokenAcessoDTO(String token, UsuarioDTO usuario) {
        this.token = token;
        this.usuario = usuario;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTipo() { return tipo; }

    public UsuarioDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioDTO usuario) { this.usuario = usuario; }
}
