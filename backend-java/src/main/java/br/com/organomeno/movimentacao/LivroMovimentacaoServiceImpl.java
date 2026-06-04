package br.com.organomeno.movimentacao;

import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.lancamento.LancamentoRepository;
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
    LancamentoRepository lancamentoRepository;

    @Override
    public List<LivroMovimentacaoDTO> listarMovimentacoes() {
        return movimentacaoRepository.listAll().stream()
                .map(LivroMovimentacaoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LivroMovimentacaoDTO criarMovimentacao(LivroMovimentacaoDTO dto) {
        if (dto.getIdConta() == null) {
            throw new IllegalArgumentException("A conta é obrigatória.");
        }
        if (dto.getTipoMovimentacao() == null || dto.getTipoMovimentacao().isBlank()) {
            throw new IllegalArgumentException("O tipo de movimentação é obrigatório (ENTRADA ou SAIDA).");
        }

        LivroMovimentacao movimentacao = LivroMovimentacaoMapper.toEntity(dto, contaRepository, lancamentoRepository);
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
    public LivroMovimentacaoDTO atualizarMovimentacao(Long id, LivroMovimentacaoDTO dto) {
        LivroMovimentacao movimentacao = movimentacaoRepository.findById(id);
        if (movimentacao == null) {
            throw new IllegalArgumentException("Movimentação não encontrada com o ID: " + id);
        }
        if (dto.getIdConta() == null) {
            throw new IllegalArgumentException("A conta é obrigatória.");
        }
        if (dto.getTipoMovimentacao() == null || dto.getTipoMovimentacao().isBlank()) {
            throw new IllegalArgumentException("O tipo de movimentação é obrigatório (ENTRADA ou SAIDA).");
        }

        if (dto.getIdConta() != null) {
            var conta = contaRepository.findById(dto.getIdConta());
            if (conta == null) throw new IllegalArgumentException("Conta não encontrada com o ID: " + dto.getIdConta());
            movimentacao.setConta(conta);
        }

        if (dto.getIdLancamento() != null) {
            var lancamento = lancamentoRepository.findById(dto.getIdLancamento());
            if (lancamento == null) throw new IllegalArgumentException("Lançamento não encontrado com o ID: " + dto.getIdLancamento());
            movimentacao.setLancamento(lancamento);
        } else {
            movimentacao.setLancamento(null);
        }

        if (dto.getDataMovimentacao() != null && !dto.getDataMovimentacao().isBlank()) {
            try {
                java.text.SimpleDateFormat df = new java.text.SimpleDateFormat("yyyy-MM-dd");
                movimentacao.setDataMovimentacao(df.parse(dto.getDataMovimentacao()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Data de movimentação inválida. Use o formato yyyy-MM-dd.");
            }
        }

        if (dto.getValor() != null && !dto.getValor().isBlank()) {
            try {
                movimentacao.setValor(new java.math.BigDecimal(dto.getValor().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Valor inválido. Utilize um valor numérico.");
            }
        }

        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setNome(dto.getNome());
        movimentacao.setTipoMovimentacao(dto.getTipoMovimentacao());

        movimentacaoRepository.persist(movimentacao);
        movimentacaoRepository.flush();
        return LivroMovimentacaoMapper.toDTO(movimentacao);
    }
}
