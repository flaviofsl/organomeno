package br.com.organomeno.recorrencia;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

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
    private Integer id;

    /**
     * Indica se a recorrência é sobre uma DESPESA ou uma RECEITA
     */
    @Column(name = "TIPO")
    private String tipo;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "DATA_CADASTRO")
    private Date dataCadastro;

    /**
     * Tipo de recorrência (ex: MENSAL, ANUAL, SEMANAL, DIARIO, etc.)
     */
    @Column(name = "TIPO_RECORRENCIA")
    private String tipoRecorrencia;

    /**
     * Se a recorrência estiver ligada a uma despesa, armazenamos o id da despesa
     */
    @Column(name = "ID_DESPESA")
    private Integer idDespesa;

    /**
     * Se a recorrência estiver ligada a uma receita, armazenamos o id da receita
     */
    @Column(name = "ID_RECEITA")
    private Integer idReceita;

}

