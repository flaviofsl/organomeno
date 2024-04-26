package br.com.organomeno.notaFiscal.rest;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.services.NotaFiscalService;
import br.com.organomeno.scrapNotaFiscal.IdentificadorLayout;
import io.vertx.core.json.Json;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.PartType;
import org.jboss.resteasy.reactive.RestForm;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

@Path("/notas")
public class NotaFiscalRest {

    @Inject
    NotaFiscalService notaFiscalService;

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response inserirNotaFiscalEItens(@RestForm @PartType("text/html") String htmlFile) throws Exception {
        try {
            Document document = Jsoup.parse(htmlFile);
            IdentificadorLayout identificadorLayout = new IdentificadorLayout(document);
            return notaFiscalService.inserirNotaFiscal(identificadorLayout);
        }catch (Exception e){
            throw e;
        }
    }
}
