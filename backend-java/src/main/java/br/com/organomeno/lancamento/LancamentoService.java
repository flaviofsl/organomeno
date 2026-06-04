package br.com.organomeno.lancamento;

import java.time.LocalDate;
import java.util.List;

public interface LancamentoService {

    List<LancamentoDTO> listarPorGrupo(Long idGrupoFamiliar);

    List<LancamentoDTO> listarPorGrupoETipo(Long idGrupoFamiliar, String tipo);

    List<LancamentoDTO> listarPorGrupoEPeriodo(Long idGrupoFamiliar, LocalDate inicio, LocalDate fim);

    LancamentoDTO buscarPorId(Long id);

    LancamentoDTO criar(LancamentoDTO dto);

    LancamentoDTO atualizar(Long id, LancamentoDTO dto);

    void deletar(Long id);
}
