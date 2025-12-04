package br.com.organomeno.conta;

import java.util.List;

public interface ContaService {

    List<ContaDTO> listarContas();

    ContaDTO criarConta(ContaDTO contaDTO);

    ContaDTO buscarContaPorId(Long id);

    ContaDTO atualizarConta(Long id, ContaDTO contaDTO);
}

