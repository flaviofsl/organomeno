package br.com.organomeno.recorrencia;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.lancamento.Lancamento;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

/**
 * Controla lançamentos recorrentes (mensais, anuais, semanais, diários).
 * Referencia o lançamento-pai que originou a recorrência.
 */
@Entity
@Table(name = "RECORRENCIAS", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Recorrencia extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_RECORRENCIA")
    @EqualsAndHashCode.Include
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR")
    private GrupoFamiliar grupoFamiliar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LANCAMENTO_ORIGEM")
    private Lancamento lancamentoOrigem;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "DATA_CADASTRO")
    private Date dataCadastro;

    /**
     * MENSAL | ANUAL | SEMANAL | DIARIO
     */
    @Column(name = "TIPO_RECORRENCIA")
    private String tipoRecorrencia;

    @Column(name = "TOTAL_PARCELAS")
    private Integer totalParcelas;

    @Column(name = "PARCELA_ATUAL")
    private Integer parcelaAtual;

    @Column(name = "PROXIMA_DATA")
    private LocalDate proximaData;

    @Column(name = "ATIVO")
    private Boolean ativo = true;
}
