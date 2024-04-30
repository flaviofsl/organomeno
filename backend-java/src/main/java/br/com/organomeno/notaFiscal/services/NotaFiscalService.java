package br.com.organomeno.notaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import br.com.organomeno.scrapNotaFiscal.IdentificadorLayout;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface NotaFiscalService {

    List<NotaFiscalDTO> filtrarNotaFiscal(NotaFiscalFiltroDTO notaFiscalFiltroDTO);
    Response inserirNotaFiscal(IdentificadorLayout identificadorLayout, String descricaoArquivo ) throws Exception;
}
