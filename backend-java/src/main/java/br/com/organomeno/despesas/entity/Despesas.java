package br.com.organomeno.despesas.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

import jakarta.persistence.*;
import java.util.Date;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "DESPESAS", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA needs a no-arg constructor (protected is ok)
@AllArgsConstructor
@ToString(exclude = "notaFiscal") // evita problemas com lazy-loading
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Despesas extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DESPESAS")
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "ID_CATEGORIA")
    private Integer idCategoria;

    @Column(name = "DESPESA_NOME")
    private String nome;

    @Column(name = "DESPESA_DESCRICAO")
    private String descricao;

    @Column(name = "DESPESA_VALOR_BRUTO")
    private Double valorBruto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTA_FISCAL_VINCULADA")
    private NotaFiscal notaFiscal;

    @Column(name = "DATA_CADASTRO")
    private Date dataCadastro;

    @Column(name = "TRANSACAO_FITID")
    private String fitId;

    @Column(name = "ID_CONTA")
    private Integer idConta;

    @Column(name = "ID_OPERADOR")
    private Integer idOperador;

    @Column(name = "DATA_TRANSACAO")
    private Date dataTransacao;
}