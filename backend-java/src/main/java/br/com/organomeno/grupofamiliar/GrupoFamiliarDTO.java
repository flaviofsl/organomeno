package br.com.organomeno.grupofamiliar;

import java.time.LocalDateTime;

public class GrupoFamiliarDTO {

    private Long id;
    private String nome;
    private String descricao;
    private String plano;
    private LocalDateTime dataCriacao;
    private Boolean ativo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getPlano() { return plano; }
    public void setPlano(String plano) { this.plano = plano; }

    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
