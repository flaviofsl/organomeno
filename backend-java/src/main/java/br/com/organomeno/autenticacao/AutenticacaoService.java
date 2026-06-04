package br.com.organomeno.autenticacao;

public interface AutenticacaoService {

    UsuarioDTO cadastrar(CadastroUsuarioDTO dto);

    TokenAcessoDTO login(LoginDTO dto);

    void solicitarRecuperacaoSenha(String email);

    void redefinirSenha(String token, String novaSenha);
}
