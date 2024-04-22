package br.com.organomeno.receitas.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;

import java.util.Date;

public class ReceitasDTO {
    private Integer id;
    private String descricao;
    private Double valorBruto;
    private Double valorLiquido;
    private Date dataEntrada;
    private NotaFiscalDTO notaFiscal;

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

    public Date getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(Date dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public NotaFiscalDTO getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(NotaFiscalDTO notaFiscal) {
        this.notaFiscal = notaFiscal;
    }
}
