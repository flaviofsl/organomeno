package br.com.organomeno.ofx.entity;

import br.com.organomeno.lancamento.Lancamento;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

@Entity
@Table(name = "ARQUIVO_OFX_TRANSACOES")
public class ArquivoOfxTransacao extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ARQUIVO_OFX_TRANSACAO")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_ARQUIVO_OFX", nullable = false)
    private ArquivoOfx arquivoOfx;

    // Lançamento gerado a partir desta transação OFX (conciliação)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_LANCAMENTO")
    private Lancamento lancamento;

    @Column(name = "FIT_ID", nullable = false)
    private String fitId;

    @Column(name = "TIPO_TRANSACAO", nullable = false)
    private String tipoTransacao; // RECEITA ou DESPESA

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ArquivoOfx getArquivoOfx() { return arquivoOfx; }
    public void setArquivoOfx(ArquivoOfx arquivoOfx) { this.arquivoOfx = arquivoOfx; }

    public Lancamento getLancamento() { return lancamento; }
    public void setLancamento(Lancamento lancamento) { this.lancamento = lancamento; }

    public String getFitId() { return fitId; }
    public void setFitId(String fitId) { this.fitId = fitId; }

    public String getTipoTransacao() { return tipoTransacao; }
    public void setTipoTransacao(String tipoTransacao) { this.tipoTransacao = tipoTransacao; }
}

