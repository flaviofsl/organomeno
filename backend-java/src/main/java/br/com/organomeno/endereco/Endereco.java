package br.com.organomeno.endereco;


import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ENDERECOS", schema = "dbo")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA needs a no-arg constructor (protected is ok)
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Endereco extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ENDERECO")
    private Integer id;

    @Column(name = "ID_PESSOA")
    private Integer idPessoa;

    @Column(name = "nome_endereco")
    private String nomeEndereco;

    @Column(name = "ENDERECO")
    private String endereco;

    @Column(name = "COMPLEMENTO_ENDERECO")
    private String complemento;

    @Column(name = "NUMERO_ENDERECO")
    private String numero;

    @Column(name = "BAIRRO")
    private String bairro;

    @Column(name = "CIDADE")
    private String cidade;

    @Column(name = "UF")
    private String uf;

    @Column(name = "CEP")
    private String cep;
}
