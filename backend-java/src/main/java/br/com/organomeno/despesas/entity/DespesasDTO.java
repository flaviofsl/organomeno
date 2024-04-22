package br.com.organomeno.despesas.entity;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;

import java.util.Date;

public class DespesasDTO {
    private Integer id;
    private ContasCategoriasDTO categoria;
    private String descricao;
    private Double valorBruto;
    private Double valorLiquido;
    private Date vencimento;
    private NotaFiscalDTO notaFiscal;
    private Date dataCadastro;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ContasCategoriasDTO getCategoria() {
        return categoria;
    }

    public void setCategoria(ContasCategoriasDTO categoria) {
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

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}
