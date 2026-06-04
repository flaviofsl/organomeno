package br.com.organomeno.autenticacao;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidade de credencial de acesso ao sistema.
 * Papel: ADMIN | MEMBRO | VISUALIZADOR
 * Status: ATIVO | INATIVO | PENDENTE
 */
@Entity
@Table(name = "USUARIO", uniqueConstraints = {
        @UniqueConstraint(name = "uk_usuario_email", columnNames = "EMAIL")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Usuario extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USUARIO")
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR", nullable = false)
    private GrupoFamiliar grupoFamiliar;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "SENHA_HASH", nullable = false)
    private String senhaHash;

    /**
     * ADMIN: gerencia grupo, convida membros, acesso total
     * MEMBRO: lança receitas/despesas, visualiza tudo
     * VISUALIZADOR: somente leitura
     */
    @Column(name = "PAPEL", nullable = false)
    private String papel;

    /**
     * ATIVO | INATIVO | PENDENTE
     */
    @Column(name = "STATUS", nullable = false)
    private String status;

    @Column(name = "DATA_CRIACAO", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "ULTIMO_ACESSO")
    private LocalDateTime ultimoAcesso;

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
        if (papel == null) {
            papel = "MEMBRO";
        }
        if (status == null) {
            status = "ATIVO";
        }
    }
}
