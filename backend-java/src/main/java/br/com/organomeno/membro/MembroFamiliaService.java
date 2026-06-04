package br.com.organomeno.membro;

import java.util.List;

public interface MembroFamiliaService {

    List<MembroFamiliaDTO> listarPorGrupo(Long idGrupoFamiliar);

    MembroFamiliaDTO buscarPorId(Long id);

    MembroFamiliaDTO criar(MembroFamiliaDTO dto);

    MembroFamiliaDTO atualizar(Long id, MembroFamiliaDTO dto);

    void desativar(Long id);
}
