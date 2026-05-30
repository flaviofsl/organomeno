package br.com.organomeno.ofx.entity;

public class ResultadoImportacaoOfxDTO {

    private Long arquivoId;
    private String nomeArquivo;
    private int quantidadeReceitas;
    private int quantidadeDespesas;
    private String mensagem;

    public ResultadoImportacaoOfxDTO() {
    }

    public ResultadoImportacaoOfxDTO(Long arquivoId, String nomeArquivo, int quantidadeReceitas, int quantidadeDespesas, String mensagem) {
        this.arquivoId = arquivoId;
        this.nomeArquivo = nomeArquivo;
        this.quantidadeReceitas = quantidadeReceitas;
        this.quantidadeDespesas = quantidadeDespesas;
        this.mensagem = mensagem;
    }

    public Long getArquivoId() {
        return arquivoId;
    }

    public void setArquivoId(Long arquivoId) {
        this.arquivoId = arquivoId;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public int getQuantidadeReceitas() {
        return quantidadeReceitas;
    }

    public void setQuantidadeReceitas(int quantidadeReceitas) {
        this.quantidadeReceitas = quantidadeReceitas;
    }

    public int getQuantidadeDespesas() {
        return quantidadeDespesas;
    }

    public void setQuantidadeDespesas(int quantidadeDespesas) {
        this.quantidadeDespesas = quantidadeDespesas;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }
}
