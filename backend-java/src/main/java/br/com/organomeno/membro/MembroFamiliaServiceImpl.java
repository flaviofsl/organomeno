package br.com.organomeno.membro;

import br.com.organomeno.autenticacao.Usuario;
import br.com.organomeno.autenticacao.UsuarioRepository;
import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.grupofamiliar.GrupoFamiliarRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class MembroFamiliaServiceImpl implements MembroFamiliaService {

    @Inject MembroFamiliaRepository membroFamiliaRepository;
    @Inject GrupoFamiliarRepository grupoFamiliarRepository;
    @Inject UsuarioRepository usuarioRepository;

    @Override
    public List<MembroFamiliaDTO> listarPorGrupo(Long idGrupoFamiliar) {
        return membroFamiliaRepository.findByGrupo(idGrupoFamiliar).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MembroFamiliaDTO buscarPorId(Long id) {
        MembroFamilia m = membroFamiliaRepository.findById(id);
        if (m == null) throw new IllegalArgumentException("Membro não encontrado: " + id);
        return toDTO(m);
    }

    @Override
    @Transactional
    public MembroFamiliaDTO criar(MembroFamiliaDTO dto) {
        validar(dto);
        MembroFamilia m = new MembroFamilia();
        preencher(m, dto);
        membroFamiliaRepository.persist(m);
        membroFamiliaRepository.flush();
        return toDTO(m);
    }

    @Override
    @Transactional
    public MembroFamiliaDTO atualizar(Long id, MembroFamiliaDTO dto) {
        MembroFamilia m = membroFamiliaRepository.findById(id);
        if (m == null) throw new IllegalArgumentException("Membro não encontrado: " + id);
        validar(dto);
        preencher(m, dto);
        membroFamiliaRepository.persist(m);
        membroFamiliaRepository.flush();
        return toDTO(m);
    }

    @Override
    @Transactional
    public void desativar(Long id) {
        MembroFamilia m = membroFamiliaRepository.findById(id);
        if (m == null) throw new IllegalArgumentException("Membro não encontrado: " + id);
        m.setAtivo(false);
        membroFamiliaRepository.persist(m);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void validar(MembroFamiliaDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank())
            throw new IllegalArgumentException("Nome do membro é obrigatório.");
        if (dto.getIdGrupoFamiliar() == null)
            throw new IllegalArgumentException("Grupo familiar é obrigatório.");
    }

    private void preencher(MembroFamilia m, MembroFamiliaDTO dto) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(dto.getIdGrupoFamiliar());
        if (grupo == null) throw new IllegalArgumentException("Grupo familiar não encontrado: " + dto.getIdGrupoFamiliar());
        m.setGrupoFamiliar(grupo);

        if (dto.getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getIdUsuario());
            m.setUsuario(usuario);
        }

        m.setNome(dto.getNome());
        m.setPapelFinanceiro(dto.getPapelFinanceiro());
        m.setRendaMensal(dto.getRendaMensal());
        m.setOrcamentoMensal(dto.getOrcamentoMensal());
        m.setDataNascimento(dto.getDataNascimento());
        m.setTipoPessoa(dto.getTipoPessoa());
        m.setCpf(dto.getCpf());
        m.setCnpj(dto.getCnpj());
        m.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
    }

    private MembroFamiliaDTO toDTO(MembroFamilia m) {
        MembroFamiliaDTO dto = new MembroFamiliaDTO();
        dto.setId(m.getId());
        dto.setNome(m.getNome());
        dto.setPapelFinanceiro(m.getPapelFinanceiro());
        dto.setRendaMensal(m.getRendaMensal());
        dto.setOrcamentoMensal(m.getOrcamentoMensal());
        dto.setDataNascimento(m.getDataNascimento());
        dto.setTipoPessoa(m.getTipoPessoa());
        dto.setCpf(m.getCpf());
        dto.setCnpj(m.getCnpj());
        dto.setAtivo(m.getAtivo());
        if (m.getGrupoFamiliar() != null) dto.setIdGrupoFamiliar(m.getGrupoFamiliar().getId());
        if (m.getUsuario() != null) dto.setIdUsuario(m.getUsuario().getId());
        return dto;
    }
}
