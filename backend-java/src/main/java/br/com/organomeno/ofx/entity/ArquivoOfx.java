package br.com.organomeno.ofx.entity;

import br.com.organomeno.conta.Conta;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ARQUIVOS_OFX")
public class ArquivoOfx extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ARQUIVO_OFX")
    private Long id;

    @Column(name = "NOME_ARQUIVO", nullable = false)
    private String nomeArquivo;

    @Column(name = "DATA_IMPORTACAO", nullable = false)
    private LocalDateTime dataImportacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CONTA", nullable = false)
    private Conta conta;

    @Column(name = "QUANTIDADE_RECEITAS")
    private Integer quantidadeReceitas;

    @Column(name = "QUANTIDADE_DESPESAS")
    private Integer quantidadeDespesas;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public LocalDateTime getDataImportacao() {
        return dataImportacao;
    }

    public void setDataImportacao(LocalDateTime dataImportacao) {
        this.dataImportacao = dataImportacao;
    }

    public Conta getConta() {
        return conta;
    }

    public void setConta(Conta conta) {
        this.conta = conta;
    }

    public Integer getQuantidadeReceitas() {
        return quantidadeReceitas;
    }

    public void setQuantidadeReceitas(Integer quantidadeReceitas) {
        this.quantidadeReceitas = quantidadeReceitas;
    }

    public Integer getQuantidadeDespesas() {
        return quantidadeDespesas;
    }

    public void setQuantidadeDespesas(Integer quantidadeDespesas) {
        this.quantidadeDespesas = quantidadeDespesas;
    }
}

