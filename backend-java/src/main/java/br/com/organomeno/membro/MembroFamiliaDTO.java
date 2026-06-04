package br.com.organomeno.membro;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MembroFamiliaDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private Long idUsuario;
    private String nome;
    private String papelFinanceiro; // PROVEDOR_PRINCIPAL | CO_PROVEDOR | DEPENDENTE
    private BigDecimal rendaMensal;
    private BigDecimal orcamentoMensal;
    private LocalDate dataNascimento;
    private String tipoPessoa;
    private String cpf;
    private String cnpj;
    private Boolean ativo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getPapelFinanceiro() { return papelFinanceiro; }
    public void setPapelFinanceiro(String papelFinanceiro) { this.papelFinanceiro = papelFinanceiro; }

    public BigDecimal getRendaMensal() { return rendaMensal; }
    public void setRendaMensal(BigDecimal rendaMensal) { this.rendaMensal = rendaMensal; }

    public BigDecimal getOrcamentoMensal() { return orcamentoMensal; }
    public void setOrcamentoMensal(BigDecimal orcamentoMensal) { this.orcamentoMensal = orcamentoMensal; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTipoPessoa() { return tipoPessoa; }
    public void setTipoPessoa(String tipoPessoa) { this.tipoPessoa = tipoPessoa; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
