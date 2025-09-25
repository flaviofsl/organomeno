package br.com.organomeno.pessoa;

import java.util.List;

public interface PessoaService {

    List<PessoaDTO> listarPessoas();

    PessoaDTO criarPessoa(PessoaDTO pessoaDTO);

    List<DependenciaDTO> listarDependencias();

    List<DependenciaDTO> listarDependenciasPorResponsavel(Long responsavelId);

    DependenciaDTO criarDependencia(DependenciaDTO dependenciaDTO);
}
