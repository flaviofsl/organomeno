package br.com.organomeno.contasCategorias.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "CONTAS_CATEGORIAS", schema = "dbo")
public class ContasCategorias extends PanacheEntityBase {

    public enum CategoriaDescricao {
        CREDIT, DEBIT, INT, DIV, FEE, SRVCHG, DEP, ATM, POS, XFER, CHECK,
        PAYMENT, CASH, DIRECTDEP, DIRECTDEBIT, REPEATPMT, HOLD, OTHER
    }

    @Id
    @Column(name = "ID_CATEGORIA")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "CATEGORIA_DESCRICAO")
    private CategoriaDescricao descricao;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CategoriaDescricao getDescricao() {
        return descricao;
    }

    public void setDescricao(CategoriaDescricao descricao) {
        this.descricao = descricao;
    }
}
