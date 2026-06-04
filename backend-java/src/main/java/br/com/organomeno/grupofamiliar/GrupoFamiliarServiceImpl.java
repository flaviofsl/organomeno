package br.com.organomeno.grupofamiliar;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class GrupoFamiliarServiceImpl implements GrupoFamiliarService {

    @Inject
    GrupoFamiliarRepository grupoFamiliarRepository;

    @Override
    public List<GrupoFamiliarDTO> listarGrupos() {
        return grupoFamiliarRepository.listAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GrupoFamiliarDTO buscarPorId(Long id) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(id);
        if (grupo == null) {
            throw new IllegalArgumentException("Grupo familiar não encontrado com o ID: " + id);
        }
        return toDTO(grupo);
    }

    @Override
    @Transactional
    public GrupoFamiliarDTO atualizar(Long id, GrupoFamiliarDTO dto) {
        GrupoFamiliar grupo = grupoFamiliarRepository.findById(id);
        if (grupo == null) {
            throw new IllegalArgumentException("Grupo familiar não encontrado com o ID: " + id);
        }
        if (dto.getNome() != null && !dto.getNome().isBlank()) {
            grupo.setNome(dto.getNome());
        }
        if (dto.getDescricao() != null) {
            grupo.setDescricao(dto.getDescricao());
        }
        if (dto.getPlano() != null) {
            grupo.setPlano(dto.getPlano());
        }
        grupoFamiliarRepository.persist(grupo);
        grupoFamiliarRepository.flush();
        return toDTO(grupo);
    }

    private GrupoFamiliarDTO toDTO(GrupoFamiliar g) {
        GrupoFamiliarDTO dto = new GrupoFamiliarDTO();
        dto.setId(g.getId());
        dto.setNome(g.getNome());
        dto.setDescricao(g.getDescricao());
        dto.setPlano(g.getPlano());
        dto.setDataCriacao(g.getDataCriacao());
        dto.setAtivo(g.getAtivo());
        return dto;
    }
}
