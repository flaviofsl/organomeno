package br.com.organomeno.entidade;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.grupofamiliar.GrupoFamiliarRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class EntidadeExternaServiceImpl implements EntidadeExternaService {

    @Inject EntidadeExternaRepository entidadeExternaRepository;
    @Inject GrupoFamiliarRepository grupoFamiliarRepository;

    @Override
    public List<EntidadeExternaDTO> listarPorGrupo(Long idGrupoFamiliar) {
        return entidadeExternaRepository.findByGrupo(idGrupoFamiliar).stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public EntidadeExternaDTO buscarPorId(Long id) {
        EntidadeExterna e = entidadeExternaRepository.findById(id);
        if (e == null) throw new IllegalArgumentException("Entidade não encontrada: " + id);
        return toDTO(e);
    }

    @Override
    @Transactional
    public EntidadeExternaDTO criar(EntidadeExternaDTO dto) {
        validar(dto);
        EntidadeExterna e = new EntidadeExterna();
        preencher(e, dto);
        entidadeExternaRepository.persist(e);
        entidadeExternaRepository.flush();
        return toDTO(e);
    }

    @Override
    @Transactional
    public EntidadeExternaDTO atualizar(Long id, EntidadeExternaDTO dto) {
        EntidadeExterna e = entidadeExternaRepository.findById(id);
        if (e == null) throw new IllegalArgumentException("Entidade não encontrada: " + id);
        validar(dto);
        preencher(e, dto);
        entidadeExternaRepository.persist(e);
        entidadeExternaRepository.flush();
        return toDTO(e);
    }

    @Override
    @Transactional
    public void desativar(Long id) {
        EntidadeExterna e = entidadeExternaRepository.findById(id);
        if (e == null) throw new IllegalArgumentException("Entidade não encontrada: " + id);
        e.setAtivo(false);
        entidadeExternaRepository.persist(e);
    }

    private void validar(EntidadeExternaDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank())
            throw new IllegalArgumentException("Nome da entidade é obrigatório.");
        if (dto.getIdGrupoFamiliar() == null)
            throw new IllegalArgumentException("Grupo familiar é obrigatório.");
    }

    private void preencher(EntidadeExterna e, EntidadeExternaDTO dto) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(dto.getIdGrupoFamiliar());
        if (grupo == null) throw new IllegalArgumentException("Grupo familiar não encontrado: " + dto.getIdGrupoFamiliar());
        e.setGrupoFamiliar(grupo);
        e.setNome(dto.getNome());
        e.setTipoPessoa(dto.getTipoPessoa());
        e.setCpf(dto.getCpf());
        e.setCnpj(dto.getCnpj());
        e.setIe(dto.getIe());
        e.setRg(dto.getRg());
        e.setIrpf(dto.getIrpf());
        e.setIrpj(dto.getIrpj());
        e.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
    }

    private EntidadeExternaDTO toDTO(EntidadeExterna e) {
        EntidadeExternaDTO dto = new EntidadeExternaDTO();
        dto.setId(e.getId());
        dto.setNome(e.getNome());
        dto.setTipoPessoa(e.getTipoPessoa());
        dto.setCpf(e.getCpf());
        dto.setCnpj(e.getCnpj());
        dto.setIe(e.getIe());
        dto.setRg(e.getRg());
        dto.setIrpf(e.getIrpf());
        dto.setIrpj(e.getIrpj());
        dto.setAtivo(e.getAtivo());
        if (e.getGrupoFamiliar() != null) dto.setIdGrupoFamiliar(e.getGrupoFamiliar().getId());
        return dto;
    }
}
