package br.com.organomeno.notaFiscal.rest;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.services.NotaFiscalService;
import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/notas")
public class NotaFiscalRest {

    @Inject
    NotaFiscalService notaFiscalService;

    @POST
    @Path("/")
    public Response inserirNotaFiscalEItens(NotaFiscalDTO notaFiscalDTO) throws Exception {
        try {
            notaFiscalService.inserirNotaFiscal(notaFiscalDTO);
            return Response.ok(Json.encode("Nota inserida com sucesso")).build();
        }catch (Exception e){
            throw e;
        }
    }
}
