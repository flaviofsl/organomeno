package br.com.organomeno.movimentacao;

import java.util.List;

public interface LivroMovimentacaoService {

    List<LivroMovimentacaoDTO> listarMovimentacoes();

    LivroMovimentacaoDTO criarMovimentacao(LivroMovimentacaoDTO movimentacaoDTO);

    LivroMovimentacaoDTO buscarMovimentacaoPorId(Long id);

    LivroMovimentacaoDTO atualizarMovimentacao(Long id, LivroMovimentacaoDTO movimentacaoDTO);
}

