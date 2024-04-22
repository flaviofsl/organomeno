package br.com.organomeno.notaFiscal;

import org.mapstruct.Mapper;

@Mapper(componentModel = "cdi")
public interface NotaFiscalMapper {
    NotaFiscalDTO toDto(NotaFiscal notaFiscal);
    NotaFiscal toEntity(NotaFiscalDTO notaFiscalDTO);
}
