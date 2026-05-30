package br.com.organomeno.transferencias;

import br.com.organomeno.conta.Conta;

public final class TransferenciaMapper {

    private TransferenciaMapper() {
    }

    public static Transferencia toEntity(TransferenciaDTO dto, Conta contaOrigem, Conta contaDestino) {
        Transferencia transferencia = new Transferencia();
        transferencia.setId(dto.getId());
        transferencia.setContaOrigem(contaOrigem);
        transferencia.setContaDestino(contaDestino);
        transferencia.setValor(dto.getValor());
        transferencia.setDataTransferencia(dto.getDataTransferencia());
        transferencia.setDescricao(dto.getDescricao());
        transferencia.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true);
        return transferencia;
    }

    public static TransferenciaDTO toDTO(Transferencia transferencia) {
        TransferenciaDTO dto = new TransferenciaDTO();
        dto.setId(transferencia.getId());
        if (transferencia.getContaOrigem() != null) {
            dto.setIdContaOrigem(transferencia.getContaOrigem().getId().intValue());
            dto.setNomeContaOrigem(transferencia.getContaOrigem().getNome());
        }
        if (transferencia.getContaDestino() != null) {
            dto.setIdContaDestino(transferencia.getContaDestino().getId().intValue());
            dto.setNomeContaDestino(transferencia.getContaDestino().getNome());
        }
        dto.setValor(transferencia.getValor());
        dto.setDataTransferencia(transferencia.getDataTransferencia());
        dto.setDescricao(transferencia.getDescricao());
        dto.setAtiva(transferencia.getAtiva());
        return dto;
    }
}


