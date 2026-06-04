package br.com.organomeno.movimentacao;

public class LivroMovimentacaoDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private Long idConta;
    private String nomeConta;
    private Long idLancamento;
    private String descricaoLancamento;
    private String tipoLancamento;
    private String dataMovimentacao;
    private String valor;
    private String descricao;
    private String nome;
    private String tipoMovimentacao;
    private String dataCadastro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public Long getIdConta() { return idConta; }
    public void setIdConta(Long idConta) { this.idConta = idConta; }

    public String getNomeConta() { return nomeConta; }
    public void setNomeConta(String nomeConta) { this.nomeConta = nomeConta; }

    public Long getIdLancamento() { return idLancamento; }
    public void setIdLancamento(Long idLancamento) { this.idLancamento = idLancamento; }

    public String getDescricaoLancamento() { return descricaoLancamento; }
    public void setDescricaoLancamento(String descricaoLancamento) { this.descricaoLancamento = descricaoLancamento; }

    public String getTipoLancamento() { return tipoLancamento; }
    public void setTipoLancamento(String tipoLancamento) { this.tipoLancamento = tipoLancamento; }

    public String getDataMovimentacao() { return dataMovimentacao; }
    public void setDataMovimentacao(String dataMovimentacao) { this.dataMovimentacao = dataMovimentacao; }

    public String getValor() { return valor; }
    public void setValor(String valor) { this.valor = valor; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipoMovimentacao() { return tipoMovimentacao; }
    public void setTipoMovimentacao(String tipoMovimentacao) { this.tipoMovimentacao = tipoMovimentacao; }

    public String getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(String dataCadastro) { this.dataCadastro = dataCadastro; }
}
