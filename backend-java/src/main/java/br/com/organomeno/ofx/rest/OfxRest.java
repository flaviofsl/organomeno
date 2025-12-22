package br.com.organomeno.ofx.rest;

import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import br.com.organomeno.ofx.services.ArquivoOfxService;
import br.com.organomeno.ofx.services.OfxService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import java.io.FileInputStream;



@Path("/ofx")
public class OfxRest {

    @Inject
    OfxService ofxService;

    @Inject
    ArquivoOfxService arquivoOfxService;

    private static final Logger LOG = Logger.getLogger(OfxRest.class.getName());


    @GET
    @Path("/")
    public String hello() {
        return "Hello RESTEasy Reactive";
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(MulitipleDocumentDetailsRequest documentDetailsRequests) {

            LOG.info("File name: " + documentDetailsRequests.getFileUpload().get(0).fileName());
            LOG.info("Id Conta: " + documentDetailsRequests.getIdConta());

            String arquivo = documentDetailsRequests.getFileUpload().get(0).uploadedFile().toString();
            try {
                FileInputStream streamFile = new FileInputStream(arquivo);
                return ofxService.fazerLeituraDeOFX(documentDetailsRequests);
            }  catch (Exception e) {
                LOG.error("Erro ao processar arquivo OFX", e);
                throw new RuntimeException(e);
            }
    }

    @GET
    @Path("/listar")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listarArquivosImportados() {
        try {
            return Response.ok(arquivoOfxService.listarArquivosImportados()).build();
        } catch (Exception e) {
            LOG.error("Erro ao listar arquivos importados", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao listar arquivos importados: " + e.getMessage())
                    .build();
        }
    }

    @GET
    @Path("/{id}/detalhes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response buscarDetalhesArquivo(@PathParam("id") Long id) {
        try {
            return Response.ok(arquivoOfxService.buscarDetalhesArquivo(id)).build();
        } catch (IllegalArgumentException e) {
            LOG.error("Arquivo não encontrado", e);
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Arquivo não encontrado: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            LOG.error("Erro ao buscar detalhes do arquivo", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao buscar detalhes do arquivo: " + e.getMessage())
                    .build();
        }
    }

}
