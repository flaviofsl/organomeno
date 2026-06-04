package br.com.organomeno.grupofamiliar;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "GRUPO_FAMILIAR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class GrupoFamiliar extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_GRUPO_FAMILIAR")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "PLANO")
    private String plano;

    @Column(name = "DATA_CRIACAO", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;

    @PrePersist
    public void prePersist() {
        if (dataCriacao == null) {
            dataCriacao = LocalDateTime.now();
        }
        if (ativo == null) {
            ativo = true;
        }
        if (plano == null) {
            plano = "BASICO";
        }
    }
}
