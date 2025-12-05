package br.com.organomeno.movimentacao;

import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class LivroMovimentacaoServiceImpl implements LivroMovimentacaoService {

    @Inject
    LivroMovimentacaoRepository movimentacaoRepository;

    @Inject
    ContaRepository contaRepository;

    @Inject
    ReceitasRepository receitasRepository;

    @Inject
    DespesasRepository despesasRepository;

    @Override
    public List<LivroMovimentacaoDTO> listarMovimentacoes() {
        return movimentacaoRepository.listAll().stream()
                .map(LivroMovimentacaoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LivroMovimentacaoDTO criarMovimentacao(LivroMovimentacaoDTO movimentacaoDTO) {
        if (movimentacaoDTO.getIdConta() == null) {
            throw new IllegalArgumentException("A conta é obrigatória.");
        }

        if (movimentacaoDTO.getTipoMovimentacao() == null || movimentacaoDTO.getTipoMovimentacao().isBlank()) {
            throw new IllegalArgumentException("O tipo de movimentação é obrigatório (ENTRADA ou SAIDA).");
        }

        LivroMovimentacao movimentacao = LivroMovimentacaoMapper.toEntity(
                movimentacaoDTO, 
                contaRepository, 
                receitasRepository, 
                despesasRepository
        );

        movimentacaoRepository.persist(movimentacao);
        movimentacaoRepository.flush();
        return LivroMovimentacaoMapper.toDTO(movimentacao);
    }

    @Override
    public LivroMovimentacaoDTO buscarMovimentacaoPorId(Long id) {
        LivroMovimentacao movimentacao = movimentacaoRepository.findById(id);
        if (movimentacao == null) {
            throw new IllegalArgumentException("Movimentação não encontrada com o ID: " + id);
        }
        return LivroMovimentacaoMapper.toDTO(movimentacao);
    }

    @Override
    @Transactional
    public LivroMovimentacaoDTO atualizarMovimentacao(Long id, LivroMovimentacaoDTO movimentacaoDTO) {
        LivroMovimentacao movimentacao = movimentacaoRepository.findById(id);
        if (movimentacao == null) {
            throw new IllegalArgumentException("Movimentação não encontrada com o ID: " + id);
        }

        if (movimentacaoDTO.getIdConta() == null) {
            throw new IllegalArgumentException("A conta é obrigatória.");
        }

        if (movimentacaoDTO.getTipoMovimentacao() == null || movimentacaoDTO.getTipoMovimentacao().isBlank()) {
            throw new IllegalArgumentException("O tipo de movimentação é obrigatório (ENTRADA ou SAIDA).");
        }

        // Atualizar conta
        if (movimentacaoDTO.getIdConta() != null) {
            var conta = contaRepository.findById(movimentacaoDTO.getIdConta());
            if (conta == null) {
                throw new IllegalArgumentException("Conta não encontrada com o ID: " + movimentacaoDTO.getIdConta());
            }
            movimentacao.setConta(conta);
        }

        // Atualizar receita
        if (movimentacaoDTO.getIdReceita() != null) {
            var receita = receitasRepository.findById(movimentacaoDTO.getIdReceita());
            if (receita == null) {
                throw new IllegalArgumentException("Receita não encontrada com o ID: " + movimentacaoDTO.getIdReceita());
            }
            movimentacao.setReceita(receita);
        } else {
            movimentacao.setReceita(null);
        }

        // Atualizar despesa
        if (movimentacaoDTO.getIdDespesa() != null) {
            var despesa = despesasRepository.findById(movimentacaoDTO.getIdDespesa());
            if (despesa == null) {
                throw new IllegalArgumentException("Despesa não encontrada com o ID: " + movimentacaoDTO.getIdDespesa());
            }
            movimentacao.setDespesa(despesa);
        } else {
            movimentacao.setDespesa(null);
        }

        // Atualizar data da movimentação
        if (movimentacaoDTO.getDataMovimentacao() != null && !movimentacaoDTO.getDataMovimentacao().isBlank()) {
            try {
                java.text.SimpleDateFormat dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd");
                movimentacao.setDataMovimentacao(dateFormat.parse(movimentacaoDTO.getDataMovimentacao()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Data de movimentação inválida. Use o formato yyyy-MM-dd.");
            }
        }

        // Atualizar valor
        if (movimentacaoDTO.getValor() != null && !movimentacaoDTO.getValor().isBlank()) {
            try {
                movimentacao.setValor(new java.math.BigDecimal(movimentacaoDTO.getValor().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Valor inválido. Utilize um valor numérico.");
            }
        }

        movimentacao.setDescricao(movimentacaoDTO.getDescricao());
        movimentacao.setTipoMovimentacao(movimentacaoDTO.getTipoMovimentacao());

        movimentacaoRepository.persist(movimentacao);
        movimentacaoRepository.flush();
        return LivroMovimentacaoMapper.toDTO(movimentacao);
    }
}

