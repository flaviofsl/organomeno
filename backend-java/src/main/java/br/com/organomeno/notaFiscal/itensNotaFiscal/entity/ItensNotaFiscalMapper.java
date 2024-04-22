package br.com.organomeno.notaFiscal.itensNotaFiscal.entity;

import br.com.organomeno.notaFiscal.entity.NotaFiscalMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "cdi", uses = NotaFiscalMapper.class)
public interface ItensNotaFiscalMapper {

    ItensNotaFiscal toEntity(ItensNotaFiscalDTO itensNotaFiscalDTO);

    ItensNotaFiscalDTO toDTO(ItensNotaFiscal itensNotaFiscal);

    List<ItensNotaFiscal> toListEntity(List<ItensNotaFiscalDTO> itens);

    List<ItensNotaFiscalDTO> toListDTO(List<ItensNotaFiscal> itens);
}
