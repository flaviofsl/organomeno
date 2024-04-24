package br.com.organomeno.contasCategorias.entity;

public class ContasCategoriasDTO {
    private Integer id;
    private ContasCategorias.CategoriaDescricao descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ContasCategorias.CategoriaDescricao getDescricao() {
        return descricao;
    }

    public void setDescricao(ContasCategorias.CategoriaDescricao descricao) {
        this.descricao = descricao;
    }
}
