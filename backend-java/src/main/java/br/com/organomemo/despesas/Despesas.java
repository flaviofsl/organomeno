package br.com.organomemo.despesas;

import br.com.organomemo.contasCategorias.ContasCategorias;
import br.com.organomemo.notaFiscal.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "DESPESAS", schema = "dbo")
public class Despesas extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DESPESAS")
    private Integer id;
    @Column(name = "CATEGORIA_VINCULADA")
    private ContasCategorias categoria;
    @Column(name = "DESPESA_DESCRICAO")
    private String descricao;
    @Column(name = "DESPESA_VALOR_BRUTO")
    private Double valorBruto;
    @Column(name = "DESPESA_VALOR_LIQUIDO")
    private Double valorLiquido;
    @Column(name = "DESPESA_VENCIMENTO")
    private Date vencimento;
    @Column(name = "NOTA_FISCAL_VINCULADA")
    private NotaFiscal notaFiscal;

    public NotaFiscal getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(NotaFiscal notaFiscal) {
        this.notaFiscal = notaFiscal;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ContasCategorias getCategoria() {
        return categoria;
    }

    public void setCategoria(ContasCategorias categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValorBruto() {
        return valorBruto;
    }

    public void setValorBruto(Double valorBruto) {
        this.valorBruto = valorBruto;
    }

    public Double getValorLiquido() {
        return valorLiquido;
    }

    public void setValorLiquido(Double valorLiquido) {
        this.valorLiquido = valorLiquido;
    }

    public Date getVencimento() {
        return vencimento;
    }

    public void setVencimento(Date vencimento) {
        this.vencimento = vencimento;
    }
}
