package br.com.organomeno.transferencias;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.conta.ContaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class TransferenciaServiceImpl implements TransferenciaService {

    @Inject
    TransferenciaRepository transferenciaRepository;

    @Inject
    ContaRepository contaRepository;

    @Override
    public List<TransferenciaDTO> listarTransferencias() {
        return transferenciaRepository.listAll().stream()
                .map(TransferenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransferenciaDTO criarTransferencia(TransferenciaDTO transferenciaDTO) {
        validarTransferencia(transferenciaDTO, false);

        Conta contaOrigem = contaRepository.findById(transferenciaDTO.getIdContaOrigem().longValue());
        Conta contaDestino = contaRepository.findById(transferenciaDTO.getIdContaDestino().longValue());

        if (contaOrigem == null) {
            throw new IllegalArgumentException("Conta de origem não encontrada com o ID: " + transferenciaDTO.getIdContaOrigem());
        }
        if (contaDestino == null) {
            throw new IllegalArgumentException("Conta de destino não encontrada com o ID: " + transferenciaDTO.getIdContaDestino());
        }

        if (contaOrigem.getId().equals(contaDestino.getId())) {
            throw new IllegalArgumentException("A conta de origem não pode ser igual à conta de destino.");
        }

        Transferencia transferencia = TransferenciaMapper.toEntity(transferenciaDTO, contaOrigem, contaDestino);
        transferenciaRepository.persist(transferencia);
        transferenciaRepository.flush();
        return TransferenciaMapper.toDTO(transferencia);
    }

    @Override
    public TransferenciaDTO buscarTransferenciaPorId(Long id) {
        Transferencia transferencia = transferenciaRepository.findById(id);
        if (transferencia == null) {
            throw new IllegalArgumentException("Transferência não encontrada com o ID: " + id);
        }
        return TransferenciaMapper.toDTO(transferencia);
    }

    @Override
    @Transactional
    public TransferenciaDTO atualizarTransferencia(Long id, TransferenciaDTO transferenciaDTO) {
        Transferencia transferencia = transferenciaRepository.findById(id);
        if (transferencia == null) {
            throw new IllegalArgumentException("Transferência não encontrada com o ID: " + id);
        }

        validarTransferencia(transferenciaDTO, true);

        Conta contaOrigem = contaRepository.findById(transferenciaDTO.getIdContaOrigem().longValue());
        Conta contaDestino = contaRepository.findById(transferenciaDTO.getIdContaDestino().longValue());

        if (contaOrigem == null) {
            throw new IllegalArgumentException("Conta de origem não encontrada com o ID: " + transferenciaDTO.getIdContaOrigem());
        }
        if (contaDestino == null) {
            throw new IllegalArgumentException("Conta de destino não encontrada com o ID: " + transferenciaDTO.getIdContaDestino());
        }

        if (contaOrigem.getId().equals(contaDestino.getId())) {
            throw new IllegalArgumentException("A conta de origem não pode ser igual à conta de destino.");
        }

        transferencia.setContaOrigem(contaOrigem);
        transferencia.setContaDestino(contaDestino);
        transferencia.setValor(transferenciaDTO.getValor());
        transferencia.setDataTransferencia(transferenciaDTO.getDataTransferencia());
        transferencia.setDescricao(transferenciaDTO.getDescricao());
        transferencia.setAtiva(transferenciaDTO.getAtiva() != null ? transferenciaDTO.getAtiva() : true);

        transferenciaRepository.persist(transferencia);
        transferenciaRepository.flush();
        return TransferenciaMapper.toDTO(transferencia);
    }

    @Override
    @Transactional
    public void deletarTransferencia(Long id) {
        Transferencia transferencia = transferenciaRepository.findById(id);
        if (transferencia == null) {
            throw new IllegalArgumentException("Transferência não encontrada com o ID: " + id);
        }
        transferenciaRepository.delete(transferencia);
    }

    @Override
    public List<TransferenciaDTO> listarTransferenciasPorContaOrigem(Long idContaOrigem) {
        return transferenciaRepository.findByContaOrigem(idContaOrigem.intValue()).stream()
                .map(TransferenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransferenciaDTO> listarTransferenciasPorContaDestino(Long idContaDestino) {
        return transferenciaRepository.findByContaDestino(idContaDestino.intValue()).stream()
                .map(TransferenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransferenciaDTO> listarTransferenciasPorConta(Long idConta) {
        return transferenciaRepository.findByContaOrigemOrDestino(idConta.intValue()).stream()
                .map(TransferenciaMapper::toDTO)
                .collect(Collectors.toList());
    }

    private void validarTransferencia(TransferenciaDTO transferenciaDTO, boolean ehAtualizacao) {
        if (transferenciaDTO.getIdContaOrigem() == null) {
            throw new IllegalArgumentException("A conta de origem é obrigatória.");
        }
        if (transferenciaDTO.getIdContaDestino() == null) {
            throw new IllegalArgumentException("A conta de destino é obrigatória.");
        }
        if (transferenciaDTO.getValor() == null || transferenciaDTO.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da transferência deve ser maior que zero.");
        }
        if (transferenciaDTO.getDataTransferencia() == null) {
            throw new IllegalArgumentException("A data da transferência é obrigatória.");
        }
    }
}


