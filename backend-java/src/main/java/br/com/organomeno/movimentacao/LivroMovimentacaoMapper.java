package br.com.organomeno.movimentacao;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.repository.ReceitasRepository;

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
                                             ReceitasRepository receitasRepository,
                                             DespesasRepository despesasRepository) {
        LivroMovimentacao movimentacao = new LivroMovimentacao();
        movimentacao.setId(dto.getId());

        // Conta é obrigatória
        if (dto.getIdConta() != null) {
            Conta conta = contaRepository.findById(dto.getIdConta());
            if (conta == null) {
                throw new IllegalArgumentException("Conta não encontrada com o ID: " + dto.getIdConta());
            }
            movimentacao.setConta(conta);
        }

        // Receita (opcional)
        if (dto.getIdReceita() != null) {
            Receitas receita = receitasRepository.findById(dto.getIdReceita());
            if (receita == null) {
                throw new IllegalArgumentException("Receita não encontrada com o ID: " + dto.getIdReceita());
            }
            movimentacao.setReceita(receita);
        }

        // Despesa (opcional)
        if (dto.getIdDespesa() != null) {
            Despesas despesa = despesasRepository.findById(dto.getIdDespesa());
            if (despesa == null) {
                throw new IllegalArgumentException("Despesa não encontrada com o ID: " + dto.getIdDespesa());
            }
            movimentacao.setDespesa(despesa);
        }

        // Data da movimentação
        if (dto.getDataMovimentacao() != null && !dto.getDataMovimentacao().isBlank()) {
            try {
                movimentacao.setDataMovimentacao(dateFormat.parse(dto.getDataMovimentacao()));
            } catch (Exception e) {
                throw new IllegalArgumentException("Data de movimentação inválida. Use o formato yyyy-MM-dd.");
            }
        } else {
            movimentacao.setDataMovimentacao(new Date());
        }

        // Valor
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
        movimentacao.setTipoMovimentacao(dto.getTipoMovimentacao() != null ? dto.getTipoMovimentacao() : "ENTRADA");

        // Data de cadastro
        if (movimentacao.getId() == null) {
            movimentacao.setDataCadastro(new Date());
        }

        return movimentacao;
    }

    public static LivroMovimentacaoDTO toDTO(LivroMovimentacao movimentacao) {
        LivroMovimentacaoDTO dto = new LivroMovimentacaoDTO();
        dto.setId(movimentacao.getId());

        if (movimentacao.getConta() != null) {
            dto.setIdConta(movimentacao.getConta().getId());
            dto.setNomeConta(movimentacao.getConta().getNome());
        }

        if (movimentacao.getReceita() != null) {
            dto.setIdReceita(movimentacao.getReceita().getId());
            dto.setDescricaoReceita(movimentacao.getReceita().getDescricao());
        }

        if (movimentacao.getDespesa() != null) {
            dto.setIdDespesa(movimentacao.getDespesa().getId());
            dto.setDescricaoDespesa(movimentacao.getDespesa().getDescricao());
        }

        if (movimentacao.getDataMovimentacao() != null) {
            dto.setDataMovimentacao(dateFormat.format(movimentacao.getDataMovimentacao()));
        }

        if (movimentacao.getValor() != null) {
            dto.setValor(movimentacao.getValor().toString());
        }

        dto.setDescricao(movimentacao.getDescricao());
        dto.setTipoMovimentacao(movimentacao.getTipoMovimentacao());

        if (movimentacao.getDataCadastro() != null) {
            dto.setDataCadastro(dateTimeFormat.format(movimentacao.getDataCadastro()));
        }

        return dto;
    }
}

