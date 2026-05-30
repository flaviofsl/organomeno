package br.com.organomeno.ofx.entity;

import java.util.Date;

public class TransacaoOfxPreviewDTO {

    private String fitId;
    private String descricao;
    private Double valor;
    private Date data;
    private String tipo;
    private Integer idCategoria;

    public TransacaoOfxPreviewDTO() {
    }

    public TransacaoOfxPreviewDTO(String fitId, String descricao, Double valor, Date data, String tipo, Integer idCategoria) {
        this.fitId = fitId;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.tipo = tipo;
        this.idCategoria = idCategoria;
    }

    public String getFitId() {
        return fitId;
    }

    public void setFitId(String fitId) {
        this.fitId = fitId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }
}
