package br.com.organomeno.notaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import br.com.organomeno.scrapNotaFiscal.IdentificadorLayout;
import jakarta.ws.rs.core.Response;

public interface NotaFiscalService {

    Response filtrarNotaFiscal(NotaFiscalFiltroDTO notaFiscalFiltroDTO);
    Response inserirNotaFiscal(IdentificadorLayout identificadorLayout ) throws Exception;
}
