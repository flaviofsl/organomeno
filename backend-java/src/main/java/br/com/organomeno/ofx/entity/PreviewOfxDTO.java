package br.com.organomeno.ofx.entity;

import java.util.List;

public class PreviewOfxDTO {

    private String nomeArquivo;
    private List<TransacaoOfxPreviewDTO> transacoes;
    private int totalReceitas;
    private int totalDespesas;

    public PreviewOfxDTO() {
    }

    public PreviewOfxDTO(String nomeArquivo, List<TransacaoOfxPreviewDTO> transacoes, int totalReceitas, int totalDespesas) {
        this.nomeArquivo = nomeArquivo;
        this.transacoes = transacoes;
        this.totalReceitas = totalReceitas;
        this.totalDespesas = totalDespesas;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public List<TransacaoOfxPreviewDTO> getTransacoes() {
        return transacoes;
    }

    public void setTransacoes(List<TransacaoOfxPreviewDTO> transacoes) {
        this.transacoes = transacoes;
    }

    public int getTotalReceitas() {
        return totalReceitas;
    }

    public void setTotalReceitas(int totalReceitas) {
        this.totalReceitas = totalReceitas;
    }

    public int getTotalDespesas() {
        return totalDespesas;
    }

    public void setTotalDespesas(int totalDespesas) {
        this.totalDespesas = totalDespesas;
    }
}
