package br.com.organomeno.ofx.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.movimentacao.LivroMovimentacao;
import br.com.organomeno.movimentacao.LivroMovimentacaoDTO;
import br.com.organomeno.movimentacao.LivroMovimentacaoMapper;
import br.com.organomeno.movimentacao.LivroMovimentacaoRepository;
import br.com.organomeno.ofx.entity.ArquivoOfx;
import br.com.organomeno.ofx.entity.ArquivoOfxDTO;
import br.com.organomeno.ofx.entity.DetalhesArquivoOfxDTO;
import br.com.organomeno.ofx.repository.ArquivoOfxRepository;
import br.com.organomeno.ofx.repository.ArquivoOfxTransacaoRepository;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ArquivoOfxServiceImpl implements ArquivoOfxService {

    @Inject
    ArquivoOfxRepository arquivoOfxRepository;

    @Inject
    ArquivoOfxTransacaoRepository arquivoOfxTransacaoRepository;

    @Inject
    LivroMovimentacaoRepository movimentacaoRepository;

    @Inject
    ReceitasRepository receitasRepository;

    @Inject
    DespesasRepository despesasRepository;

    @Inject
    ReceitasMapper receitasMapper;

    @Inject
    DespesasMapper despesasMapper;

    @Override
    public List<ArquivoOfxDTO> listarArquivosImportados() {
        return arquivoOfxRepository.listAll().stream()
                .sorted((a1, a2) -> a2.getDataImportacao().compareTo(a1.getDataImportacao()))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DetalhesArquivoOfxDTO buscarDetalhesArquivo(Long idArquivo) {
        ArquivoOfx arquivoOfx = arquivoOfxRepository.findById(idArquivo);
        if (arquivoOfx == null) {
            throw new IllegalArgumentException("Arquivo OFX não encontrado com o ID: " + idArquivo);
        }

        ArquivoOfxDTO arquivoDTO = toDTO(arquivoOfx);

        // Buscar fitIds das transações do arquivo
        List<String> fitIds = arquivoOfxTransacaoRepository.findByArquivoOfxId(idArquivo)
                .stream()
                .map(t -> t.getFitId())
                .collect(Collectors.toList());

        // Buscar receitas e despesas pelos fitIds
        List<ReceitasDTO> receitasImportadas = new ArrayList<>();
        List<DespesasDTO> despesasImportadas = new ArrayList<>();
        List<Integer> receitasIds = new ArrayList<>();
        List<Integer> despesasIds = new ArrayList<>();

        for (String fitId : fitIds) {
            Receitas receita = receitasRepository.findByFitId(fitId);
            if (receita != null) {
                receitasImportadas.add(receitasMapper.toDTO(receita));
                receitasIds.add(receita.getId());
            }

            Despesas despesa = despesasRepository.findByFitId(fitId);
            if (despesa != null) {
                despesasImportadas.add(despesasMapper.toDTO(despesa));
                despesasIds.add(despesa.getId());
            }
        }

        // Buscar movimentações que referenciam essas receitas e despesas
        List<LivroMovimentacaoDTO> movimentacoes = new ArrayList<>();

        if (!receitasIds.isEmpty()) {
            List<LivroMovimentacao> movimentacoesReceitas = movimentacaoRepository
                    .find("receita.id IN ?1", receitasIds).list();
            movimentacoes.addAll(movimentacoesReceitas.stream()
                    .map(LivroMovimentacaoMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        if (!despesasIds.isEmpty()) {
            List<LivroMovimentacao> movimentacoesDespesas = movimentacaoRepository
                    .find("despesa.id IN ?1", despesasIds).list();
            movimentacoes.addAll(movimentacoesDespesas.stream()
                    .map(LivroMovimentacaoMapper::toDTO)
                    .collect(Collectors.toList()));
        }

        return new DetalhesArquivoOfxDTO(arquivoDTO, receitasImportadas, despesasImportadas, movimentacoes);
    }

    private ArquivoOfxDTO toDTO(ArquivoOfx arquivoOfx) {
        ArquivoOfxDTO dto = new ArquivoOfxDTO();
        dto.setId(arquivoOfx.getId());
        dto.setNomeArquivo(arquivoOfx.getNomeArquivo());
        dto.setDataImportacao(arquivoOfx.getDataImportacao());
        dto.setIdConta(arquivoOfx.getConta().getId());
        dto.setNomeConta(arquivoOfx.getConta().getNome());
        dto.setQuantidadeReceitas(arquivoOfx.getQuantidadeReceitas());
        dto.setQuantidadeDespesas(arquivoOfx.getQuantidadeDespesas());
        return dto;
    }
}

