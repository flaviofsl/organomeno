package br.com.organomeno.contasCategorias.entity;

import br.com.organomeno.contasCategorias.entity.ContasCategorias;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface ContasCategoriasMapper {

    ContasCategorias toEntity(ContasCategoriasDTO contasCategoriasDTO);
    ContasCategoriasDTO toDto(ContasCategorias contasCategorias);
}
