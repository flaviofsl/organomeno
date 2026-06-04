package br.com.organomeno.movimentacao;

import br.com.organomeno.autenticacao.Usuario;
import br.com.organomeno.conta.Conta;
import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.lancamento.Lancamento;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "LIVRO_MOVIMENTACAO")
public class LivroMovimentacao extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_MOVIMENTACAO")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GRUPO_FAMILIAR")
    private GrupoFamiliar grupoFamiliar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONTA")
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LANCAMENTO")
    private Lancamento lancamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO_CRIADOR")
    private Usuario usuarioCriador;

    @Column(name = "DATA_MOVIMENTACAO", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataMovimentacao;

    @Column(name = "VALOR", precision = 19, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(name = "NOME")
    private String nome;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "TIPO_MOVIMENTACAO", nullable = false)
    private String tipoMovimentacao; // ENTRADA ou SAIDA

    @Column(name = "DATA_CADASTRO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCadastro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public GrupoFamiliar getGrupoFamiliar() { return grupoFamiliar; }
    public void setGrupoFamiliar(GrupoFamiliar grupoFamiliar) { this.grupoFamiliar = grupoFamiliar; }

    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }

    public Lancamento getLancamento() { return lancamento; }
    public void setLancamento(Lancamento lancamento) { this.lancamento = lancamento; }

    public Usuario getUsuarioCriador() { return usuarioCriador; }
    public void setUsuarioCriador(Usuario usuarioCriador) { this.usuarioCriador = usuarioCriador; }

    public Date getDataMovimentacao() { return dataMovimentacao; }
    public void setDataMovimentacao(Date dataMovimentacao) { this.dataMovimentacao = dataMovimentacao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getTipoMovimentacao() { return tipoMovimentacao; }
    public void setTipoMovimentacao(String tipoMovimentacao) { this.tipoMovimentacao = tipoMovimentacao; }

    public Date getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(Date dataCadastro) { this.dataCadastro = dataCadastro; }
}
