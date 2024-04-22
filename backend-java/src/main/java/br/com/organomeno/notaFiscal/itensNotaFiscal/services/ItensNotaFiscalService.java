package br.com.organomeno.notaFiscal.itensNotaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscal;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalDTO;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface ItensNotaFiscalService {
    Response inserirItensNotaFiscal(NotaFiscalDTO notaFiscalDTO,ItensNotaFiscalDTO itens) throws Exception;
}
