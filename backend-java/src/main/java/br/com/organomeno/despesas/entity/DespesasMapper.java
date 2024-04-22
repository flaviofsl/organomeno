package br.com.organomeno.despesas.entity;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.notaFiscal.NotaFiscal;
import br.com.organomeno.notaFiscal.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.NotaFiscalMapper;
import jakarta.inject.Inject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "cdi")
public interface DespesasMapper {
    Despesas toEntity(DespesasDTO despesasDTO);

    DespesasDTO toDTO(Despesas despesas);

    default List<DespesasDTO> toListDTO(List<Despesas> despesas) {
        if (despesas == null) {
            return null;
        }

        return despesas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
