package br.com.organomeno.entidade;

import java.util.List;

public interface EntidadeExternaService {

    List<EntidadeExternaDTO> listarPorGrupo(Long idGrupoFamiliar);

    EntidadeExternaDTO buscarPorId(Long id);

    EntidadeExternaDTO criar(EntidadeExternaDTO dto);

    EntidadeExternaDTO atualizar(Long id, EntidadeExternaDTO dto);

    void desativar(Long id);
}
