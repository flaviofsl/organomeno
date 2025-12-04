package br.com.organomeno.conta;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ContaServiceImpl implements ContaService {

    @Inject
    ContaRepository contaRepository;

    @Override
    public List<ContaDTO> listarContas() {
        return contaRepository.listAll().stream()
                .map(ContaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ContaDTO criarConta(ContaDTO contaDTO) {
        Conta conta = ContaMapper.toEntity(contaDTO);
        if (conta.getNome() == null || conta.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da conta é obrigatório.");
        }
        if (conta.getBanco() == null || conta.getBanco().isBlank()) {
            throw new IllegalArgumentException("O banco é obrigatório.");
        }
        contaRepository.persist(conta);
        contaRepository.flush();
        return ContaMapper.toDTO(conta);
    }

    @Override
    public ContaDTO buscarContaPorId(Long id) {
        Conta conta = contaRepository.findById(id);
        if (conta == null) {
            throw new IllegalArgumentException("Conta não encontrada com o ID: " + id);
        }
        return ContaMapper.toDTO(conta);
    }

    @Override
    @Transactional
    public ContaDTO atualizarConta(Long id, ContaDTO contaDTO) {
        Conta conta = contaRepository.findById(id);
        if (conta == null) {
            throw new IllegalArgumentException("Conta não encontrada com o ID: " + id);
        }
        
        if (contaDTO.getNome() == null || contaDTO.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da conta é obrigatório.");
        }
        if (contaDTO.getBanco() == null || contaDTO.getBanco().isBlank()) {
            throw new IllegalArgumentException("O banco é obrigatório.");
        }
        
        // Atualizar os campos
        conta.setNome(contaDTO.getNome());
        conta.setBanco(contaDTO.getBanco());
        conta.setAgencia(contaDTO.getAgencia());
        conta.setNumeroConta(contaDTO.getNumeroConta());
        conta.setTipoConta(contaDTO.getTipoConta());
        conta.setAtiva(contaDTO.getAtiva() != null ? contaDTO.getAtiva() : true);
        
        if (contaDTO.getSaldoInicial() != null && !contaDTO.getSaldoInicial().isBlank()) {
            try {
                conta.setSaldoInicial(new java.math.BigDecimal(contaDTO.getSaldoInicial().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Saldo inicial inválido. Utilize um valor numérico.");
            }
        }
        // Não alterar o saldoAtual na atualização, mantém o valor atual
        
        contaRepository.persist(conta);
        contaRepository.flush();
        return ContaMapper.toDTO(conta);
    }
}

