package br.com.organomeno.transferencias;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransferenciaDTO {

    private Integer id;
    private Integer idContaOrigem;
    private Integer idContaDestino;
    private String nomeContaOrigem;
    private String nomeContaDestino;
    private BigDecimal valor;
    private LocalDateTime dataTransferencia;
    private String descricao;
    private Boolean ativa;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdContaOrigem() {
        return idContaOrigem;
    }

    public void setIdContaOrigem(Integer idContaOrigem) {
        this.idContaOrigem = idContaOrigem;
    }

    public Integer getIdContaDestino() {
        return idContaDestino;
    }

    public void setIdContaDestino(Integer idContaDestino) {
        this.idContaDestino = idContaDestino;
    }

    public String getNomeContaOrigem() {
        return nomeContaOrigem;
    }

    public void setNomeContaOrigem(String nomeContaOrigem) {
        this.nomeContaOrigem = nomeContaOrigem;
    }

    public String getNomeContaDestino() {
        return nomeContaDestino;
    }

    public void setNomeContaDestino(String nomeContaDestino) {
        this.nomeContaDestino = nomeContaDestino;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataTransferencia() {
        return dataTransferencia;
    }

    public void setDataTransferencia(LocalDateTime dataTransferencia) {
        this.dataTransferencia = dataTransferencia;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Boolean getAtiva() {
        return ativa;
    }

    public void setAtiva(Boolean ativa) {
        this.ativa = ativa;
    }
}


