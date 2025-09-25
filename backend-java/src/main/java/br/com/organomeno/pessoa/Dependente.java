package br.com.organomeno.pessoa;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "DEPENDENCIAS")
public class Dependente extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DEPENDENCIA")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "RESPONSAVEL_ID")
    private Pessoa responsavel;

    @ManyToOne(optional = false)
    @JoinColumn(name = "DEPENDENTE_ID")
    private Pessoa pessoa;

    @Column(name = "NIVEL_DEPENDENCIA")
    private Integer nivel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pessoa getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(Pessoa responsavel) {
        this.responsavel = responsavel;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }
}
