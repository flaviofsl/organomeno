package br.com.organomeno.membro;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

/**
 * Vínculo financeiro entre dois membros da família.
 * Substitui a entidade DEPENDENCIAS antiga, agora com isolamento por grupo.
 */
@Entity
@Table(name = "DEPENDENCIA_FINANCEIRA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class DependenciaFinanceira extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DEPENDENCIA")
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR", nullable = false)
    private GrupoFamiliar grupoFamiliar;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "RESPONSAVEL_ID", nullable = false)
    private MembroFamilia responsavel;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "DEPENDENTE_ID", nullable = false)
    private MembroFamilia dependente;

    @Column(name = "NIVEL_DEPENDENCIA")
    private Integer nivel;
}
