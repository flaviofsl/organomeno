package br.com.organomeno.ofx.entity;

import java.time.LocalDateTime;

public class ArquivoOfxDTO {

    private Long id;
    private String nomeArquivo;
    private LocalDateTime dataImportacao;
    private Long idConta;
    private String nomeConta;
    private Integer quantidadeReceitas;
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

    public Long getIdConta() {
        return idConta;
    }

    public void setIdConta(Long idConta) {
        this.idConta = idConta;
    }

    public String getNomeConta() {
        return nomeConta;
    }

    public void setNomeConta(String nomeConta) {
        this.nomeConta = nomeConta;
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

