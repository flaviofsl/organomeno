package br.com.organomeno.despesas.services;

import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface DespesasService{
    List<DespesasDTO> buscarTodasAsDespesas();

    DespesasDTO buscarDespesaPorId(Integer id);

    List<DespesasDTO> buscarDespesasPorNota(NotaFiscalDTO notaFiscalDTO);

    Response inserirDespesa(DespesasDTO despesasDTO);

    List<DespesasDTO> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO);

    Response vincularNotaFiscal(List<DespesasDTO> despesasDTO);
}
