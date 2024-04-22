package br.com.organomeno.receitas.entity;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasDTO;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "cdi")
public interface ReceitasMapper {

    ReceitasDTO toDTO(Receitas entity);

    Receitas toEntity(ReceitasDTO dto);

    default List<ReceitasDTO> toListDTO(List<Receitas> receitas) {
        if (receitas == null) {
            return null;
        }
        return receitas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
