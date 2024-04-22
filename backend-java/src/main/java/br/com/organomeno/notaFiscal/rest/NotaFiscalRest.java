package br.com.organomeno.notaFiscal.rest;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.services.ItensNotaFiscalService;
import br.com.organomeno.notaFiscal.services.NotaFiscalService;
import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/notas")
public class NotaFiscalRest {

    @Inject
    NotaFiscalService notaFiscalService;
    @Inject
    ItensNotaFiscalService itensNotaFiscalService;

    @POST
    @Path("/")
    public Response inserirNotaFiscalEItens(NotaFiscalDTO notaFiscalDTO, ItensNotaFiscalDTO itensNotaFiscalDTOS) throws Exception {
        try {
            notaFiscalService.inserirNotaFiscal(notaFiscalDTO);
            itensNotaFiscalService.inserirItensNotaFiscal(notaFiscalDTO,itensNotaFiscalDTOS);
            return Response.ok(Json.encode("Nota inserida com sucesso")).build();
        }catch (Exception e){
            throw e;
        }

    }
}
