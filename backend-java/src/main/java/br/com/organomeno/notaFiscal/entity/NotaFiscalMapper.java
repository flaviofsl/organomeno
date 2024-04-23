package br.com.organomeno.notaFiscal.entity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "cdi")
public interface NotaFiscalMapper {

    NotaFiscalDTO toDto(NotaFiscal notaFiscal);

    NotaFiscal toEntity(NotaFiscalDTO notaFiscalDTO);

}
