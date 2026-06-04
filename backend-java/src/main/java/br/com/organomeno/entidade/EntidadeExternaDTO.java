package br.com.organomeno.entidade;

public class EntidadeExternaDTO {

    private Long id;
    private Long idGrupoFamiliar;
    private String nome;
    private String tipoPessoa; // FISICA | JURIDICA
    private String cpf;
    private String cnpj;
    private String ie;
    private String rg;
    private String irpf;
    private String irpj;
    private Boolean ativo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getIdGrupoFamiliar() { return idGrupoFamiliar; }
    public void setIdGrupoFamiliar(Long idGrupoFamiliar) { this.idGrupoFamiliar = idGrupoFamiliar; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipoPessoa() { return tipoPessoa; }
    public void setTipoPessoa(String tipoPessoa) { this.tipoPessoa = tipoPessoa; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }

    public String getIe() { return ie; }
    public void setIe(String ie) { this.ie = ie; }

    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }

    public String getIrpf() { return irpf; }
    public void setIrpf(String irpf) { this.irpf = irpf; }

    public String getIrpj() { return irpj; }
    public void setIrpj(String irpj) { this.irpj = irpj; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
