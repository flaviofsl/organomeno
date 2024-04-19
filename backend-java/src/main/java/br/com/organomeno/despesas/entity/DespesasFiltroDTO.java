package br.com.organomeno.despesas.entity;

import br.com.organomeno.notaFiscal.NotaFiscal;
import br.com.organomeno.notaFiscal.NotaFiscalDTO;
import jakarta.ws.rs.QueryParam;

import java.util.Date;

public class DespesasFiltroDTO {
    @QueryParam("categoria")
    private Integer categoria;
    @QueryParam("descricao")
    private String descricao;
    @QueryParam("valorBruto")
    private Double valorBruto;
    @QueryParam("valorLiquido")
    private Double valorLiquido;
    @QueryParam("vencimento")
    private Date vencimento;
    @QueryParam("notaFiscal")
    private NotaFiscalDTO notaFiscal;

    public Integer getCategoria() {
        return categoria;
    }

    public void setCategoria(Integer categoria) {
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

    public NotaFiscalDTO getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(NotaFiscalDTO notaFiscal) {
        this.notaFiscal = notaFiscal;
    }
}
