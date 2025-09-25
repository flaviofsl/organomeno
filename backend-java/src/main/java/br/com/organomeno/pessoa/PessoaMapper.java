package br.com.organomeno.pessoa;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public final class PessoaMapper {

    private PessoaMapper() {
    }

    public static Pessoa toEntity(PessoaDTO dto) {
        Pessoa pessoa = new Pessoa();
        pessoa.setId(dto.getId());
        pessoa.setNome(dto.getNome());
        pessoa.setTipo(dto.getTipo());
        pessoa.setCpf(dto.getCpf());
        pessoa.setRg(dto.getRg());
        pessoa.setSexo(dto.getSexo());
        pessoa.setIrpf(dto.getIrpf());
        pessoa.setCnpj(dto.getCnpj());
        pessoa.setIe(dto.getIe());
        pessoa.setIrpj(dto.getIrpj());

        if (dto.getDataNascimento() != null && !dto.getDataNascimento().isBlank()) {
            try {
                pessoa.setDataNascimento(LocalDate.parse(dto.getDataNascimento()));
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("Data de nascimento inválida. Utilize o formato AAAA-MM-DD.");
            }
        } else {
            pessoa.setDataNascimento(null);
        }

        return pessoa;
    }

    public static PessoaDTO toDTO(Pessoa pessoa) {
        PessoaDTO dto = new PessoaDTO();
        dto.setId(pessoa.getId());
        dto.setNome(pessoa.getNome());
        dto.setTipo(pessoa.getTipo());
        dto.setCpf(pessoa.getCpf());
        dto.setRg(pessoa.getRg());
        dto.setSexo(pessoa.getSexo());
        dto.setIrpf(pessoa.getIrpf());
        dto.setCnpj(pessoa.getCnpj());
        dto.setIe(pessoa.getIe());
        dto.setIrpj(pessoa.getIrpj());

        if (pessoa.getDataNascimento() != null) {
            dto.setDataNascimento(pessoa.getDataNascimento().toString());
        }

        return dto;
    }

    public static DependenciaDTO toDTO(Dependente dependente) {
        DependenciaDTO dto = new DependenciaDTO();
        dto.setId(dependente.getId());
        if (dependente.getResponsavel() != null) {
            dto.setResponsavelId(dependente.getResponsavel().getId());
            dto.setResponsavelNome(dependente.getResponsavel().getNome());
        }
        if (dependente.getPessoa() != null) {
            dto.setDependenteId(dependente.getPessoa().getId());
            dto.setDependenteNome(dependente.getPessoa().getNome());
        }
        dto.setNivel(dependente.getNivel());
        return dto;
    }
}
