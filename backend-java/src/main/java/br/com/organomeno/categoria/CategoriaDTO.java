package br.com.organomeno.categoria;

public class CategoriaDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private String nome;
    private String descricao;
    private String tipo;
    private String icone;
    private String cor;
    private Boolean ativa;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getIcone() { return icone; }
    public void setIcone(String icone) { this.icone = icone; }

    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }

    public Boolean getAtiva() { return ativa; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }
}

