package br.com.organomeno.movimentacao;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.lancamento.Lancamento;
import br.com.organomeno.lancamento.LancamentoRepository;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

public final class LivroMovimentacaoMapper {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private static final SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private LivroMovimentacaoMapper() {
    }

    public static LivroMovimentacao toEntity(LivroMovimentacaoDTO dto,
                                             ContaRepository contaRepository,
                                             LancamentoRepository lancamentoRepository) {
        LivroMovimentacao movimentacao = new LivroMovimentacao();
        movimentacao.setId(dto.getId());

        if (dto.getIdConta() != null) {
            Conta conta = contaRepository.findById(dto.getIdConta());
            if (conta == null) {
                throw new IllegalArgumentException("Conta não encontrada com o ID: " + dto.getIdConta());
            }
            movimentacao.setConta(conta);
        }

        if (dto.getIdLancamento() != null) {
            Lancamento lancamento = lancamentoRepository.findById(dto.getIdLancamento());
            if (lancamento == null) {
                throw new IllegalArgumentException("Lançamento não encontrado com o ID: " + dto.getIdLancamento());
            }
            movimentacao.setLancamento(lancamento);
        }

        if (dto.getDataMovimentacao() != null && !dto.getDataMovimentacao().isBlank()) {
            try {
                movimentacao.setDataMovimentacao(dateFormat.parse(dto.getDataMovimentacao()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Data de movimentação inválida. Use o formato yyyy-MM-dd.");
            }
        } else {
            movimentacao.setDataMovimentacao(new Date());
        }

        if (dto.getValor() != null && !dto.getValor().isBlank()) {
            try {
                movimentacao.setValor(new BigDecimal(dto.getValor().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Valor inválido. Utilize um valor numérico.");
            }
        } else {
            throw new IllegalArgumentException("O valor é obrigatório.");
        }

        movimentacao.setDescricao(dto.getDescricao());
        movimentacao.setNome(dto.getNome());
        movimentacao.setTipoMovimentacao(dto.getTipoMovimentacao() != null ? dto.getTipoMovimentacao() : "ENTRADA");

        if (movimentacao.getId() == null) {
            movimentacao.setDataCadastro(new Date());
        }

        return movimentacao;
    }

    public static LivroMovimentacaoDTO toDTO(LivroMovimentacao movimentacao) {
        LivroMovimentacaoDTO dto = new LivroMovimentacaoDTO();
        dto.setId(movimentacao.getId());

        if (movimentacao.getGrupoFamiliar() != null) {
            dto.setIdGrupoFamiliar(movimentacao.getGrupoFamiliar().getId());
        }

        if (movimentacao.getConta() != null) {
            dto.setIdConta(movimentacao.getConta().getId());
            dto.setNomeConta(movimentacao.getConta().getNome());
        }

        if (movimentacao.getLancamento() != null) {
            dto.setIdLancamento(movimentacao.getLancamento().getId());
            dto.setDescricaoLancamento(movimentacao.getLancamento().getDescricao());
            dto.setTipoLancamento(movimentacao.getLancamento().getTipo());
        }

        if (movimentacao.getDataMovimentacao() != null) {
            dto.setDataMovimentacao(dateFormat.format(movimentacao.getDataMovimentacao()));
        }

        if (movimentacao.getValor() != null) {
            dto.setValor(movimentacao.getValor().toString());
        }

        dto.setDescricao(movimentacao.getDescricao());
        dto.setNome(movimentacao.getNome());
        dto.setTipoMovimentacao(movimentacao.getTipoMovimentacao());

        if (movimentacao.getDataCadastro() != null) {
            dto.setDataCadastro(dateTimeFormat.format(movimentacao.getDataCadastro()));
        }

        return dto;
    }
}
