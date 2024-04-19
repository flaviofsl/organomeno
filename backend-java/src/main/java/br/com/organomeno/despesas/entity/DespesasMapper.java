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
@Mapper(componentModel = "cdi")
public interface DespesasMapper {
    @Mapping(target = "notaFiscal", source = "notaFiscalDTO")
    Despesas toEntity(DespesasDTO despesasDTO);
    @Mapping(target = "notaFiscalDTO", source = "notaFiscal")
    DespesasDTO toDTO(Despesas despesas);
    @Mapping(target = "notaFiscalDTO", source = "notaFiscal")
    List<DespesasDTO> toListDTO(List<Despesas> despesas);
}
