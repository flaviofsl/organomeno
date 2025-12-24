package br.com.organomeno.despesas.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "DESPESAS", schema = "dbo")
public class Despesas extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DESPESAS")
    private Integer id;
    @Column(name = "CATEGORIA")
    private String categoria;
    @Column(name = "DESPESA_DESCRICAO")
    private String descricao;
    @Column(name = "DESPESA_VALOR_BRUTO")
    private Double valorBruto;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTA_FISCAL_VINCULADA")
    private NotaFiscal notaFiscal;
    @Column(name = "DATA_CADASTRO")
    private Date dataCadastro;
    @Column(name = "TRANSACAO_FITID")
    private String fitId;

    public String getFitId() {
        return fitId;
    }

    public void setFitId(String fitId) {
        this.fitId = fitId;
    }

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

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

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
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

}
