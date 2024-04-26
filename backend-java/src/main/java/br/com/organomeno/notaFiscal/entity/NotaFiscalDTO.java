package br.com.organomeno.notaFiscal.entity;

import br.com.organomeno.notaFiscal.itensNotaFiscal.ItensNotaFiscalDTO;

import java.util.Date;
import java.util.List;

public class NotaFiscalDTO {
    private Integer id;
    private String descricao;
    private Date dataCadastro;
    private Double valorBruto;
    private List<ItensNotaFiscalDTO> itensNotaFiscal;

    public List<ItensNotaFiscalDTO> getItensNotaFiscal() {
        return itensNotaFiscal;
    }

    public void setItensNotaFiscal(List<ItensNotaFiscalDTO> itensNotaFiscal) {
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
