package br.com.organomeno.transferencias;

import java.util.List;

public interface TransferenciaService {

    List<TransferenciaDTO> listarTransferencias();

    TransferenciaDTO criarTransferencia(TransferenciaDTO transferenciaDTO);

    TransferenciaDTO buscarTransferenciaPorId(Long id);

    TransferenciaDTO atualizarTransferencia(Long id, TransferenciaDTO transferenciaDTO);

    void deletarTransferencia(Long id);

    List<TransferenciaDTO> listarTransferenciasPorContaOrigem(Long idContaOrigem);

    List<TransferenciaDTO> listarTransferenciasPorContaDestino(Long idContaDestino);

    List<TransferenciaDTO> listarTransferenciasPorConta(Long idConta);
}


