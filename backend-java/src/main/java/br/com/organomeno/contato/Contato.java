package br.com.organomeno.contato;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "CONTATOS")
public class Contato extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONTATO")
    private Long id;

    @Column(name = "ID_PESSOA")
    private Long idPessoa;

    @Column(name = "VALOR", nullable = false)
    private String valor;

    @Column(name = "TIPO", nullable = false)
    private String tipo;

    @Column(name = "ATIVA")
    private Boolean ativa;

}

