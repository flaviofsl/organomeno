package br.com.organomeno.despesas.entity;

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
    private Integer notaFiscal;
    @QueryParam("pageNum")
    private Integer pageNum;
    @QueryParam("pageSize")
    private Integer pageSize;

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

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

    public Integer getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(Integer notaFiscal) {
        this.notaFiscal = notaFiscal;
    }
}
