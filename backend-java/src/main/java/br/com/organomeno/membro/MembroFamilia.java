package br.com.organomeno.membro;

import br.com.organomeno.autenticacao.Usuario;
import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Representa um membro da família com seus dados financeiros (renda, orçamento, papel).
 * Pode ou não estar vinculado a um Usuario (credencial de acesso).
 *
 * PAPEL_FINANCEIRO: PROVEDOR_PRINCIPAL | CO_PROVEDOR | DEPENDENTE
 */
@Entity
@Table(name = "MEMBRO_FAMILIA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class MembroFamilia extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_MEMBRO")
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR", nullable = false)
    private GrupoFamiliar grupoFamiliar;

    // Opcional: se esse membro também tem acesso ao sistema
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    private Usuario usuario;

    @Column(name = "NOME", nullable = false)
    private String nome;

    /**
     * PROVEDOR_PRINCIPAL | CO_PROVEDOR | DEPENDENTE
     */
    @Column(name = "PAPEL_FINANCEIRO")
    private String papelFinanceiro;

    @Column(name = "RENDA_MENSAL", precision = 19, scale = 2)
    private BigDecimal rendaMensal;

    @Column(name = "ORCAMENTO_MENSAL", precision = 19, scale = 2)
    private BigDecimal orcamentoMensal;

    @Column(name = "DATA_NASCIMENTO")
    private LocalDate dataNascimento;

    /**
     * FISICA | JURIDICA
     */
    @Column(name = "TIPO_PESSOA")
    private String tipoPessoa;

    @Column(name = "CPF")
    private String cpf;

    @Column(name = "CNPJ")
    private String cnpj;

    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;
}
