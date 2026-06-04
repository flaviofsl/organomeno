package br.com.organomeno.entidade;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

/**
 * Representa fornecedores, empresas e terceiros externos vinculados ao grupo familiar.
 * Substitui o conceito de PESSOAS para entidades fora da estrutura familiar.
 *
 * TIPO_PESSOA: FISICA | JURIDICA
 */
@Entity
@Table(name = "ENTIDADE_EXTERNA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class EntidadeExterna extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ENTIDADE")
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR", nullable = false)
    private GrupoFamiliar grupoFamiliar;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "TIPO_PESSOA")
    private String tipoPessoa;

    @Column(name = "CPF")
    private String cpf;

    @Column(name = "CNPJ")
    private String cnpj;

    @Column(name = "IE")
    private String ie;

    @Column(name = "RG")
    private String rg;

    @Column(name = "IRPF")
    private String irpf;

    @Column(name = "IRPJ")
    private String irpj;

    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;
}
