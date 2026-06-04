package br.com.organomeno.lancamento;

import br.com.organomeno.autenticacao.Usuario;
import br.com.organomeno.autenticacao.UsuarioRepository;
import br.com.organomeno.categoria.Categoria;
import br.com.organomeno.categoria.CategoriaRepository;
import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import br.com.organomeno.entidade.EntidadeExterna;
import br.com.organomeno.entidade.EntidadeExternaRepository;
import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.grupofamiliar.GrupoFamiliarRepository;
import br.com.organomeno.membro.MembroFamilia;
import br.com.organomeno.membro.MembroFamiliaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class LancamentoServiceImpl implements LancamentoService {

    @Inject LancamentoRepository lancamentoRepository;
    @Inject GrupoFamiliarRepository grupoFamiliarRepository;
    @Inject UsuarioRepository usuarioRepository;
    @Inject ContaRepository contaRepository;
    @Inject CategoriaRepository categoriaRepository;
    @Inject MembroFamiliaRepository membroFamiliaRepository;
    @Inject EntidadeExternaRepository entidadeExternaRepository;

    @Override
    public List<LancamentoDTO> listarPorGrupo(Long idGrupoFamiliar) {
        return lancamentoRepository.findByGrupo(idGrupoFamiliar).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<LancamentoDTO> listarPorGrupoETipo(Long idGrupoFamiliar, String tipo) {
        return lancamentoRepository.findByGrupoETipo(idGrupoFamiliar, tipo).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<LancamentoDTO> listarPorGrupoEPeriodo(Long idGrupoFamiliar, LocalDate inicio, LocalDate fim) {
        return lancamentoRepository.findByGrupoEPeriodo(idGrupoFamiliar, inicio, fim).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public LancamentoDTO buscarPorId(Long id) {
        Lancamento l = lancamentoRepository.findById(id);
        if (l == null) throw new IllegalArgumentException("Lançamento não encontrado: " + id);
        return toDTO(l);
    }

    @Override
    @Transactional
    public LancamentoDTO criar(LancamentoDTO dto) {
        validar(dto);
        Lancamento lancamento = new Lancamento();
        preencherEntidade(lancamento, dto);
        lancamentoRepository.persist(lancamento);
        lancamentoRepository.flush();
        return toDTO(lancamento);
    }

    @Override
    @Transactional
    public LancamentoDTO atualizar(Long id, LancamentoDTO dto) {
        Lancamento lancamento = lancamentoRepository.findById(id);
        if (lancamento == null) throw new IllegalArgumentException("Lançamento não encontrado: " + id);
        validar(dto);
        preencherEntidade(lancamento, dto);
        lancamentoRepository.persist(lancamento);
        lancamentoRepository.flush();
        return toDTO(lancamento);
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        Lancamento lancamento = lancamentoRepository.findById(id);
        if (lancamento == null) throw new IllegalArgumentException("Lançamento não encontrado: " + id);
        lancamento.setStatus("CANCELADO");
        lancamentoRepository.persist(lancamento);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void validar(LancamentoDTO dto) {
        if (dto.getIdGrupoFamiliar() == null)
            throw new IllegalArgumentException("Grupo familiar é obrigatório.");
        if (dto.getTipo() == null || (!dto.getTipo().equals("RECEITA") && !dto.getTipo().equals("DESPESA")))
            throw new IllegalArgumentException("Tipo deve ser RECEITA ou DESPESA.");
        if (dto.getDescricao() == null || dto.getDescricao().isBlank())
            throw new IllegalArgumentException("Descrição é obrigatória.");
        if (dto.getValorBruto() == null || dto.getValorBruto().signum() <= 0)
            throw new IllegalArgumentException("Valor deve ser maior que zero.");
        if (dto.getDataTransacao() == null)
            throw new IllegalArgumentException("Data da transação é obrigatória.");
    }

    private void preencherEntidade(Lancamento l, LancamentoDTO dto) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(dto.getIdGrupoFamiliar());
        if (grupo == null) throw new IllegalArgumentException("Grupo familiar não encontrado: " + dto.getIdGrupoFamiliar());
        l.setGrupoFamiliar(grupo);

        if (dto.getIdUsuarioCriador() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getIdUsuarioCriador());
            if (usuario == null) throw new IllegalArgumentException("Usuário não encontrado: " + dto.getIdUsuarioCriador());
            l.setUsuarioCriador(usuario);
        }

        if (dto.getIdConta() != null) {
            Conta conta = contaRepository.findById(dto.getIdConta());
            if (conta == null) throw new IllegalArgumentException("Conta não encontrada: " + dto.getIdConta());
            l.setConta(conta);
        }

        if (dto.getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(dto.getIdCategoria());
            l.setCategoria(cat);
        }

        if (dto.getIdMembro() != null) {
            MembroFamilia membro = membroFamiliaRepository.findById(dto.getIdMembro());
            l.setMembro(membro);
        }

        if (dto.getIdEntidadeExterna() != null) {
            EntidadeExterna entidade = entidadeExternaRepository.findById(dto.getIdEntidadeExterna());
            l.setEntidadeExterna(entidade);
        }

        l.setTipo(dto.getTipo());
        l.setDescricao(dto.getDescricao());
        l.setValorBruto(dto.getValorBruto());
        l.setValorLiquido(dto.getValorLiquido() != null ? dto.getValorLiquido() : dto.getValorBruto());
        l.setDataTransacao(dto.getDataTransacao());
        l.setFitId(dto.getFitId());
        l.setStatus(dto.getStatus() != null ? dto.getStatus() : "CONFIRMADO");
        l.setRecorrente(dto.getRecorrente() != null ? dto.getRecorrente() : false);
    }

    private LancamentoDTO toDTO(Lancamento l) {
        LancamentoDTO dto = new LancamentoDTO();
        dto.setId(l.getId());
        dto.setTipo(l.getTipo());
        dto.setDescricao(l.getDescricao());
        dto.setValorBruto(l.getValorBruto());
        dto.setValorLiquido(l.getValorLiquido());
        dto.setDataTransacao(l.getDataTransacao());
        dto.setDataCadastro(l.getDataCadastro());
        dto.setFitId(l.getFitId());
        dto.setStatus(l.getStatus());
        dto.setRecorrente(l.getRecorrente());
        if (l.getGrupoFamiliar() != null) dto.setIdGrupoFamiliar(l.getGrupoFamiliar().getId());
        if (l.getUsuarioCriador() != null) dto.setIdUsuarioCriador(l.getUsuarioCriador().getId());
        if (l.getConta() != null) {
            dto.setIdConta(l.getConta().getId());
            dto.setNomeConta(l.getConta().getNome());
        }
        if (l.getCategoria() != null) {
            dto.setIdCategoria(l.getCategoria().getId());
            dto.setNomeCategoria(l.getCategoria().getNome());
        }
        if (l.getMembro() != null) {
            dto.setIdMembro(l.getMembro().getId());
            dto.setNomeMembro(l.getMembro().getNome());
        }
        if (l.getEntidadeExterna() != null) {
            dto.setIdEntidadeExterna(l.getEntidadeExterna().getId());
            dto.setNomeEntidadeExterna(l.getEntidadeExterna().getNome());
        }
        if (l.getNotaFiscal() != null) {
            dto.setIdNotaFiscal((long) l.getNotaFiscal().getId().intValue());
        }
        return dto;
    }
}
