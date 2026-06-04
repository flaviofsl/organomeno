package br.com.organomeno.autenticacao;

/**
 * DTO de entrada para cadastro de novo usuário com criação de grupo familiar.
 */
public class CadastroUsuarioDTO {

    private String nome;
    private String email;
    private String senha;
    private String confirmacaoSenha;
    // Nome do grupo familiar a ser criado (usado quando é o primeiro usuário/ADMIN)
    private String nomeGrupoFamiliar;
    // Código de convite (para entrar em grupo existente)
    private String codigoConvite;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getConfirmacaoSenha() { return confirmacaoSenha; }
    public void setConfirmacaoSenha(String confirmacaoSenha) { this.confirmacaoSenha = confirmacaoSenha; }

    public String getNomeGrupoFamiliar() { return nomeGrupoFamiliar; }
    public void setNomeGrupoFamiliar(String nomeGrupoFamiliar) { this.nomeGrupoFamiliar = nomeGrupoFamiliar; }

    public String getCodigoConvite() { return codigoConvite; }
    public void setCodigoConvite(String codigoConvite) { this.codigoConvite = codigoConvite; }
}
