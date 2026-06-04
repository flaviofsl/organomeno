package br.com.organomeno.grupofamiliar;

import java.util.List;

public interface GrupoFamiliarService {

    List<GrupoFamiliarDTO> listarGrupos();

    GrupoFamiliarDTO buscarPorId(Long id);

    GrupoFamiliarDTO atualizar(Long id, GrupoFamiliarDTO dto);
}
