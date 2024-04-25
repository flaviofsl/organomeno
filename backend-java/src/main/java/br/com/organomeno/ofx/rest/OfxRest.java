package br.com.organomeno.ofx.rest;

import br.com.organomeno.ofx.services.OfxService;
import com.webcohesion.ofx4j.io.OFXParseException;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@Path("/ofx")
public class OfxRest {

    @Inject
    OfxService ofxService;

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response importarOFX(InputStream stream) throws IOException, OFXParseException {
        try {
            FileInputStream streamFile = new FileInputStream("C:\\Users\\caiocardoso\\Documents\\NU_970120221_01MAR2024_31MAR2024.ofx");
            ofxService.fazerLeituraDeOFX(streamFile);
            return Response.ok().build();
        }catch (Exception e) {
            throw e;
        }
    }
}
