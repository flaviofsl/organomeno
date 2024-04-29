package br.com.organomeno.despesas.entity;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;

import java.util.Date;

public class DespesasDTO {
    private Integer id;
    private String categoria;
    private String descricao;
    private Double valorBruto;
    private NotaFiscalDTO notaFiscal;
    private Date dataCadastro;
    private String fitId;

    public String getFitId() {
        return fitId;
    }

    public void setFitId(String fitId) {
        this.fitId = fitId;
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

    public NotaFiscalDTO getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(NotaFiscalDTO notaFiscal) {
        this.notaFiscal = notaFiscal;
    }

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
