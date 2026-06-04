package br.com.organomeno.autenticacao;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TOKEN_RECUPERACAO_SENHA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class TokenRecuperacaoSenha extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TOKEN")
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private Usuario usuario;

    @Column(name = "TOKEN", nullable = false, unique = true)
    private String token;

    @Column(name = "DATA_EXPIRACAO", nullable = false)
    private LocalDateTime dataExpiracao;

    @Column(name = "USADO", nullable = false)
    private Boolean usado = false;

    public boolean isValido() {
        return !usado && dataExpiracao.isAfter(LocalDateTime.now());
    }
}
