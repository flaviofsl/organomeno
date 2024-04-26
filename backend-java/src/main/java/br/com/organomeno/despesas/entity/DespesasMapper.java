package br.com.organomeno.despesas.entity;

import org.mapstruct.Mapper;

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

    List<Despesas> toListEntity(List<DespesasDTO> despesasDTO);
}
