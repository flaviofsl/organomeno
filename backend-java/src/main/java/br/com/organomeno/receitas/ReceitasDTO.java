package br.com.organomeno.receitas;

import br.com.organomeno.notaFiscal.NotaFiscal;

import java.util.Date;

public class ReceitasDTO {
    private Integer id;
    private String descricao;
    private Double valorBruto;
    private Double valorLiquido;
    private Date dataEntrada;
    private NotaFiscal notaFiscal;
}
