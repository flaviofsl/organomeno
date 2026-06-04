package br.com.organomeno.lancamento;

import br.com.organomeno.autenticacao.Usuario;
import br.com.organomeno.categoria.Categoria;
import br.com.organomeno.conta.Conta;
import br.com.organomeno.entidade.EntidadeExterna;
import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.membro.MembroFamilia;
import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lançamento financeiro unificado — substitui as tabelas RECEITAS e DESPESAS.
 *
 * TIPO: RECEITA | DESPESA
 * STATUS: PENDENTE | CONFIRMADO | CANCELADO | CONCILIADO
 */
@Entity
@Table(name = "LANCAMENTO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Lancamento extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_LANCAMENTO")
    @EqualsAndHashCode.Include
    private Long id;

    // ─── Tenant ────────────────────────────────────────────────────────────────

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR", nullable = false)
    private GrupoFamiliar grupoFamiliar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO_CRIADOR", nullable = false)
    private Usuario usuarioCriador;

    // ─── Relacionamentos financeiros ───────────────────────────────────────────

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONTA")
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CATEGORIA")
    private Categoria categoria;

    // Membro da família ao qual o lançamento está atribuído
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MEMBRO")
    private MembroFamilia membro;

    // Fornecedor / entidade externa envolvida
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ENTIDADE_EXTERNA")
    private EntidadeExterna entidadeExterna;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_NOTA_FISCAL")
    private NotaFiscal notaFiscal;

    // ─── Dados do lançamento ───────────────────────────────────────────────────

    /**
     * RECEITA | DESPESA
     */
    @Column(name = "TIPO", nullable = false)
    private String tipo;

    @Column(name = "DESCRICAO", nullable = false)
    private String descricao;

    @Column(name = "VALOR_BRUTO", nullable = false, precision = 19, scale = 2)
    private BigDecimal valorBruto;

    @Column(name = "VALOR_LIQUIDO", precision = 19, scale = 2)
    private BigDecimal valorLiquido;

    @Column(name = "DATA_TRANSACAO", nullable = false)
    private LocalDate dataTransacao;

    @Column(name = "DATA_CADASTRO", nullable = false)
    private LocalDateTime dataCadastro;

    // FIT ID para conciliação com arquivos OFX
    @Column(name = "FIT_ID")
    private String fitId;

    /**
     * PENDENTE | CONFIRMADO | CANCELADO | CONCILIADO
     */
    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "RECORRENTE")
    private Boolean recorrente = false;

    @PrePersist
    public void prePersist() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
        if (status == null) {
            status = "CONFIRMADO";
        }
        if (recorrente == null) {
            recorrente = false;
        }
        if (valorLiquido == null) {
            valorLiquido = valorBruto;
        }
    }
}
