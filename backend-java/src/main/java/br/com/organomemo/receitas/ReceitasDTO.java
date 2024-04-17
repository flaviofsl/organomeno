package br.com.organomemo.receitas;

import br.com.organomemo.notaFiscal.NotaFiscal;

import java.util.Date;

public class ReceitasDTO {
    private Integer id;
    private String descricao;
    private Double valorBruto;
    private Double valorLiquido;
    private Date dataEntrada;
    private NotaFiscal notaFiscal;
}
