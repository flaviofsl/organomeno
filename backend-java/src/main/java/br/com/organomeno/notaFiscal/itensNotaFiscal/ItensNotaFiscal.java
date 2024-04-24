package br.com.organomeno.notaFiscal.itensNotaFiscal;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import jakarta.persistence.*;

@Entity
@Table(name = "ITENS_NOTA_FISCAL", schema = "dbo")
public class ItensNotaFiscal extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_ID")
    private Integer id;
    @Column(name = "ITEM_UND_MEDIDA")
    private String unidadeMedida;
    @Column(name = "ITEM_QUANTIDADE")
    private Double quantidade;
    @Column(name = "ITEM_VALOR_BRUTO")
    private Double valorBruto;
    @Column(name = "ITEM_DESCRICAO")
    private String descricao;
    @ManyToOne
    @JoinColumn(name = "NOTA_VINCULADA", nullable = false)
    private NotaFiscal notaFiscal;

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUnidadeMedida() {
        return unidadeMedida;
    }

    public void setUnidadeMedida(String unidadeMedida) {
        this.unidadeMedida = unidadeMedida;
    }

    public Double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Double quantidade) {
        this.quantidade = quantidade;
    }

    public Double getValorBruto() {
        return valorBruto;
    }

    public void setValorBruto(Double valorBruto) {
        this.valorBruto = valorBruto;
    }

    public NotaFiscal getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(NotaFiscal notaFiscal) {
        this.notaFiscal = notaFiscal;
    }
}
