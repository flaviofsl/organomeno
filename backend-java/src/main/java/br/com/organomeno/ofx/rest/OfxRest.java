package br.com.organomeno.ofx.rest;

import br.com.organomeno.ofx.services.ArquivoOfxService;
import br.com.organomeno.ofx.services.OfxService;
import com.webcohesion.ofx4j.io.OFXParseException;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

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
    @Path("/preview")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response preview(MulitipleDocumentDetailsRequest documentDetailsRequests) {
        try {
            return Response.ok(ofxService.previewOfx(documentDetailsRequests)).build();
        } catch (IllegalArgumentException e) {
            LOG.warn("Requisição inválida para preview OFX", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (OFXParseException e) {
            LOG.error("Erro ao processar arquivo OFX", e);
            return Response.status(Response.Status.BAD_REQUEST).entity("Erro ao processar arquivo OFX: " + e.getMessage()).build();
        } catch (Exception e) {
            LOG.error("Erro inesperado ao processar preview OFX", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao processar arquivo OFX: " + e.getMessage())
                    .build();
        }
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(MulitipleDocumentDetailsRequest documentDetailsRequests) {
        try {
            return Response.ok(ofxService.importarOfx(documentDetailsRequests)).build();
        } catch (IllegalArgumentException e) {
            LOG.warn("Requisição inválida para importação OFX", e);
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        } catch (OFXParseException e) {
            LOG.error("Erro ao importar arquivo OFX", e);
            return Response.status(Response.Status.BAD_REQUEST).entity("Erro ao importar arquivo OFX: " + e.getMessage()).build();
        } catch (Exception e) {
            LOG.error("Erro inesperado ao importar OFX", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Erro ao importar arquivo OFX: " + e.getMessage())
                    .build();
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
