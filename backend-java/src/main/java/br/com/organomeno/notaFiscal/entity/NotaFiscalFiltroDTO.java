package br.com.organomeno.notaFiscal.entity;

import jakarta.ws.rs.QueryParam;

import java.util.Date;

public class NotaFiscalFiltroDTO {
    @QueryParam("descricao")
    private String descricao;
    @QueryParam("dataCadastro")
    private Date dataCadastro;
    @QueryParam("valorBruto")
    private Double valorBruto;
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
