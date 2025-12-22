package br.com.organomeno.ofx.entity;

import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.movimentacao.LivroMovimentacaoDTO;
import br.com.organomeno.receitas.entity.ReceitasDTO;

import java.util.List;

public class DetalhesArquivoOfxDTO {
    private ArquivoOfxDTO arquivo;
    private List<ReceitasDTO> receitas;
    private List<DespesasDTO> despesas;
    private List<LivroMovimentacaoDTO> movimentacoes;

    public DetalhesArquivoOfxDTO() {
    }

    public DetalhesArquivoOfxDTO(ArquivoOfxDTO arquivo, List<ReceitasDTO> receitas, List<DespesasDTO> despesas, List<LivroMovimentacaoDTO> movimentacoes) {
        this.arquivo = arquivo;
        this.receitas = receitas;
        this.despesas = despesas;
        this.movimentacoes = movimentacoes;
    }

    public ArquivoOfxDTO getArquivo() {
        return arquivo;
    }

    public void setArquivo(ArquivoOfxDTO arquivo) {
        this.arquivo = arquivo;
    }

    public List<ReceitasDTO> getReceitas() {
        return receitas;
    }

    public void setReceitas(List<ReceitasDTO> receitas) {
        this.receitas = receitas;
    }

    public List<DespesasDTO> getDespesas() {
        return despesas;
    }

    public void setDespesas(List<DespesasDTO> despesas) {
        this.despesas = despesas;
    }

    public List<LivroMovimentacaoDTO> getMovimentacoes() {
        return movimentacoes;
    }

    public void setMovimentacoes(List<LivroMovimentacaoDTO> movimentacoes) {
        this.movimentacoes = movimentacoes;
    }
}

