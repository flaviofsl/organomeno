package br.com.organomeno.receitas.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReceitasDTO {
    private Integer id;
    private Integer idCategoria;

    private String nome;
    private String descricao;
    private Double valorBruto;
    private NotaFiscalDTO notaFiscal;
    private Date dataCadastro;
    private Date dataTransacao;
    private String fitId;
    private Integer idConta;
    private Integer idOperador;
}
