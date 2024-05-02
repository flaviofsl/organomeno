package br.com.organomeno.notaFiscal.entity;

import br.com.organomeno.notaFiscal.itensNotaFiscal.ItensNotaFiscal;
import br.com.organomeno.notaFiscal.itensNotaFiscal.ItensNotaFiscalDTO;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "cdi")
public interface NotaFiscalMapper {

    public default NotaFiscalDTO toDto(NotaFiscal notaFiscal) {
        if (notaFiscal == null) {
            return null;
        }

        NotaFiscalDTO notaFiscalDTO = new NotaFiscalDTO();

        // Set fields from notaFiscal to notaFiscalDTO
        notaFiscalDTO.setId(notaFiscal.getId());
        notaFiscalDTO.setDescricao(notaFiscal.getDescricao());
        notaFiscalDTO.setDataCadastro(notaFiscal.getDataCadastro());
        notaFiscalDTO.setValorBruto(notaFiscal.getValorBruto());

        // Convert the list of ItensNotaFiscal entities to DTOs
        if (notaFiscal.getItensNotaFiscal() != null) {
            notaFiscalDTO.setItensNotaFiscal(notaFiscal.getItensNotaFiscal().stream()
                    .map(this::itensNotaFiscalToItensNotaFiscalDTO)
                    .collect(Collectors.toList()));
        }

        return notaFiscalDTO;
    }

    default ItensNotaFiscalDTO itensNotaFiscalToItensNotaFiscalDTO(ItensNotaFiscal itensNotaFiscal) {
        if (itensNotaFiscal == null) {
            return null;
        }

        ItensNotaFiscalDTO itensNotaFiscalDTO = new ItensNotaFiscalDTO();

        // Set fields from itensNotaFiscal to itensNotaFiscalDTO
        itensNotaFiscalDTO.setId(itensNotaFiscal.getId());
        itensNotaFiscalDTO.setUnidadeMedida(itensNotaFiscal.getUnidadeMedida());
        itensNotaFiscalDTO.setQuantidade(itensNotaFiscal.getQuantidade());
        itensNotaFiscalDTO.setValorBruto(itensNotaFiscal.getValorBruto());
        itensNotaFiscalDTO.setDescricao(itensNotaFiscal.getDescricao());

        return itensNotaFiscalDTO;
    }

    NotaFiscal toEntity(NotaFiscalDTO notaFiscalDTO);

    List<NotaFiscalDTO> toDtoList(List<NotaFiscal> notaFiscalList);
}
