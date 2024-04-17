package br.com.organomemo.contasCategorias;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.*;

@Entity
@Table(name = "CONTAS_CATEGORIAS", schema = "dbo")
public class ContasCategorias extends PanacheEntityBase {
    @Id
    @Column(name = "ID_CATEGORIA")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "CATEGORIA_DESCRICAO")
    private String descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategoriaDescricao() {
        return descricao;
    }

    public void setCategoriaDescricao(String categoriaDescricao) {
        this.descricao = categoriaDescricao;
    }
}
