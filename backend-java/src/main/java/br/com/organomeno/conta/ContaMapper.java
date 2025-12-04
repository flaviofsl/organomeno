package br.com.organomeno.conta;

import java.math.BigDecimal;

public final class ContaMapper {

    private ContaMapper() {
    }

    public static Conta toEntity(ContaDTO dto) {
        Conta conta = new Conta();
        conta.setId(dto.getId());
        conta.setNome(dto.getNome());
        conta.setBanco(dto.getBanco());
        conta.setAgencia(dto.getAgencia());
        conta.setNumeroConta(dto.getNumeroConta());
        conta.setTipoConta(dto.getTipoConta());
        conta.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true);

        if (dto.getSaldoInicial() != null && !dto.getSaldoInicial().isBlank()) {
            try {
                conta.setSaldoInicial(new BigDecimal(dto.getSaldoInicial().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Saldo inicial inválido. Utilize um valor numérico.");
            }
        } else {
            conta.setSaldoInicial(BigDecimal.ZERO);
        }

        // Saldo atual inicialmente é igual ao saldo inicial
        if (dto.getSaldoAtual() != null && !dto.getSaldoAtual().isBlank()) {
            try {
                conta.setSaldoAtual(new BigDecimal(dto.getSaldoAtual().replace(",", ".")));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Saldo atual inválido. Utilize um valor numérico.");
            }
        } else {
            // Se não informado, usa o saldo inicial
            conta.setSaldoAtual(conta.getSaldoInicial());
        }

        return conta;
    }

    public static ContaDTO toDTO(Conta conta) {
        ContaDTO dto = new ContaDTO();
        dto.setId(conta.getId());
        dto.setNome(conta.getNome());
        dto.setBanco(conta.getBanco());
        dto.setAgencia(conta.getAgencia());
        dto.setNumeroConta(conta.getNumeroConta());
        dto.setTipoConta(conta.getTipoConta());
        dto.setAtiva(conta.getAtiva());

        if (conta.getSaldoInicial() != null) {
            dto.setSaldoInicial(conta.getSaldoInicial().toString());
        }

        if (conta.getSaldoAtual() != null) {
            dto.setSaldoAtual(conta.getSaldoAtual().toString());
        }

        return dto;
    }
}

