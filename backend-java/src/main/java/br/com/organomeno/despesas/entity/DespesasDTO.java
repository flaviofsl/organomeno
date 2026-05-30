package br.com.organomeno.despesas.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "notaFiscal")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DespesasDTO {
    @EqualsAndHashCode.Include
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
