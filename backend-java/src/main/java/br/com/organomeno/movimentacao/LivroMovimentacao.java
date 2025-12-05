package br.com.organomeno.movimentacao;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.receitas.entity.Receitas;
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
    @JoinColumn(name = "ID_CONTA")
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RECEITA")
    private Receitas receita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DESPESAS")
    private Despesas despesa;

    @Column(name = "DATA_MOVIMENTACAO", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataMovimentacao;

    @Column(name = "VALOR", precision = 19, scale = 2, nullable = false)
    private BigDecimal valor;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "TIPO_MOVIMENTACAO", nullable = false)
    private String tipoMovimentacao; // ENTRADA ou SAIDA

    @Column(name = "DATA_CADASTRO")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCadastro;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public Receitas getReceita() {
        return receita;
    }

    public void setReceita(Receitas receita) {
        this.receita = receita;
    }

    public Despesas getDespesa() {
        return despesa;
    }

    public void setDespesa(Despesas despesa) {
        this.despesa = despesa;
    }

    public Date getDataMovimentacao() {
        return dataMovimentacao;
    }

    public void setDataMovimentacao(Date dataMovimentacao) {
        this.dataMovimentacao = dataMovimentacao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipoMovimentacao() {
        return tipoMovimentacao;
    }

    public void setTipoMovimentacao(String tipoMovimentacao) {
        this.tipoMovimentacao = tipoMovimentacao;
    }

    public Date getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(Date dataCadastro) {
        this.dataCadastro = dataCadastro;
    }
}

