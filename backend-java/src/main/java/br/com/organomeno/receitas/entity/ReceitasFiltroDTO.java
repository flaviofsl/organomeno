package br.com.organomeno.receitas.entity;

import jakarta.ws.rs.QueryParam;

import java.util.Date;

public class ReceitasFiltroDTO {
    @QueryParam("descricao")
    private String descricao;
    @QueryParam("valorBruto")
    private Double valorBruto;
    @QueryParam("valorLiquido")
    private Double valorLiquido;
    @QueryParam("dataCadastro")
    private Date dataCadastro;
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
        return dataCadastro;
    }

    public void setDataEntrada(Date dataEntrada) {
        this.dataCadastro = dataEntrada;
    }

    public Integer getNotaFiscal() {
        return notaFiscal;
    }

    public void setNotaFiscal(Integer notaFiscal) {
        this.notaFiscal = notaFiscal;
    }
}
