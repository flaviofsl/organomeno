package br.com.organomeno.notaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalDTO;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface NotaFiscalService {

    Response filtrarNotaFiscal(NotaFiscalFiltroDTO notaFiscalFiltroDTO);
    Response inserirNotaFiscal(NotaFiscalDTO notaFiscalDTO) throws Exception;
}
