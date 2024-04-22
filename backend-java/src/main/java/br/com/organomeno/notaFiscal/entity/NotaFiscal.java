package br.com.organomeno.notaFiscal.entity;

import br.com.organomeno.notaFiscal.itensNotaFiscal.ItensNotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "NOTA_FISCAL", schema = "dbo")
public class NotaFiscal extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NOTA_ID")
    private Integer id;
    @Column(name = "NOTA_DESCRICAO")
    private String descricao;
    @Column(name = "NOTA_DATA_CADASTRO")
    private Date dataCadastro;
    @Column(name = "NOTA_VALOR_BRUTO")
    private Double valorBruto;
    @OneToMany(mappedBy = "notaFiscal", cascade = CascadeType.ALL)
    private List<ItensNotaFiscal> itensNotaFiscal;

    public List<ItensNotaFiscal> getItensNotaFiscal() {
        return itensNotaFiscal;
    }

    public void setItensNotaFiscal(List<ItensNotaFiscal> itensNotaFiscal) {
        this.itensNotaFiscal = itensNotaFiscal;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public Double getValorBruto() {
        return valorBruto;
    }

    public void setValorBruto(Double valorBruto) {
        this.valorBruto = valorBruto;
    }
}
