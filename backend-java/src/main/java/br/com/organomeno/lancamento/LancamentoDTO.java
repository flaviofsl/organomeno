package br.com.organomeno.lancamento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO de Lançamento — unifica Receitas e Despesas.
 * TIPO: RECEITA | DESPESA
 * STATUS: PENDENTE | CONFIRMADO | CANCELADO | CONCILIADO
 */
public class LancamentoDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private Long idUsuarioCriador;
    private Long idConta;
    private String nomeConta;
    private Long idCategoria;
    private String nomeCategoria;
    private Long idMembro;
    private String nomeMembro;
    private Long idEntidadeExterna;
    private String nomeEntidadeExterna;
    private Long idNotaFiscal;
    private String tipo;           // RECEITA | DESPESA
    private String descricao;
    private BigDecimal valorBruto;
    private BigDecimal valorLiquido;
    private LocalDate dataTransacao;
    private LocalDateTime dataCadastro;
    private String fitId;
    private String status;
    private Boolean recorrente;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public Long getIdUsuarioCriador() { return idUsuarioCriador; }
    public void setIdUsuarioCriador(Long idUsuarioCriador) { this.idUsuarioCriador = idUsuarioCriador; }

    public Long getIdConta() { return idConta; }
    public void setIdConta(Long idConta) { this.idConta = idConta; }

    public String getNomeConta() { return nomeConta; }
    public void setNomeConta(String nomeConta) { this.nomeConta = nomeConta; }

    public Long getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Long idCategoria) { this.idCategoria = idCategoria; }

    public String getNomeCategoria() { return nomeCategoria; }
    public void setNomeCategoria(String nomeCategoria) { this.nomeCategoria = nomeCategoria; }

    public Long getIdMembro() { return idMembro; }
    public void setIdMembro(Long idMembro) { this.idMembro = idMembro; }

    public String getNomeMembro() { return nomeMembro; }
    public void setNomeMembro(String nomeMembro) { this.nomeMembro = nomeMembro; }

    public Long getIdEntidadeExterna() { return idEntidadeExterna; }
    public void setIdEntidadeExterna(Long idEntidadeExterna) { this.idEntidadeExterna = idEntidadeExterna; }

    public String getNomeEntidadeExterna() { return nomeEntidadeExterna; }
    public void setNomeEntidadeExterna(String nomeEntidadeExterna) { this.nomeEntidadeExterna = nomeEntidadeExterna; }

    public Long getIdNotaFiscal() { return idNotaFiscal; }
    public void setIdNotaFiscal(Long idNotaFiscal) { this.idNotaFiscal = idNotaFiscal; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValorBruto() { return valorBruto; }
    public void setValorBruto(BigDecimal valorBruto) { this.valorBruto = valorBruto; }

    public BigDecimal getValorLiquido() { return valorLiquido; }
    public void setValorLiquido(BigDecimal valorLiquido) { this.valorLiquido = valorLiquido; }

    public LocalDate getDataTransacao() { return dataTransacao; }
    public void setDataTransacao(LocalDate dataTransacao) { this.dataTransacao = dataTransacao; }

    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }

    public String getFitId() { return fitId; }
    public void setFitId(String fitId) { this.fitId = fitId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getRecorrente() { return recorrente; }
    public void setRecorrente(Boolean recorrente) { this.recorrente = recorrente; }
}
