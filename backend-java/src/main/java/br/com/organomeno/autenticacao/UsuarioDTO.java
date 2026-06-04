package br.com.organomeno.autenticacao;

import java.time.LocalDateTime;

public class UsuarioDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private String nomeGrupoFamiliar;
    private String nome;
    private String email;
    private String papel;
    private String status;
    private LocalDateTime dataCriacao;
    private LocalDateTime ultimoAcesso;
    private Boolean ativo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public String getNomeGrupoFamiliar() { return nomeGrupoFamiliar; }
    public void setNomeGrupoFamiliar(String nomeGrupoFamiliar) { this.nomeGrupoFamiliar = nomeGrupoFamiliar; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPapel() { return papel; }
    public void setPapel(String papel) { this.papel = papel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public LocalDateTime getUltimoAcesso() { return ultimoAcesso; }
    public void setUltimoAcesso(LocalDateTime ultimoAcesso) { this.ultimoAcesso = ultimoAcesso; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
