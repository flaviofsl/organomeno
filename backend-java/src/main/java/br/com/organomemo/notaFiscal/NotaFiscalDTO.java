package br.com.organomemo.notaFiscal;

import br.com.organomemo.despesas.DespesasDTO;

import java.util.Date;

public class NotaFiscalDTO {
    private Integer id;
    private String descricao;
    private Date dataCadastro;
    private Double valorBruto;
    private DespesasDTO despesasDTO;
}
