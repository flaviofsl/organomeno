package br.com.organomeno.ofx.rest;

import br.com.organomeno.ofx.services.OfxService;
import com.webcohesion.ofx4j.io.OFXParseException;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Path("/ofx")
public class OfxRest {

    @Inject
    OfxService ofxService;

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)

    public Response importarOFX(MultipartFormDataInput dataFormulario) throws IOException, OFXParseException {
        try {
            //FileInputStream streamFile = new FileInputStream("C:/Users/caiocardoso/Documents/NU_970120221_01MAR2024_31MAR2024.ofx");

            //ofxService.fazerLeituraDeOFX(streamFile);
            Map<String, List<InputPart>> formMap = dataFormulario.getFormDataMap();
            formMap.forEach((name, value
            ) -> {
                if (name.contains("arquivo")) {
                    MultipartManipulator.getParameter
                            (formMap, "dataVencimentoAssinatura", String.class).strip();

                }
            });
            return Response.ok().build();
        } catch (Exception e) {
            throw e;
        }
    }

    public class MultipartManipulator {
        public static <T> T getParameter(Map<String, List<InputPart>>
                                                 form
                , String
                                                 nome
                , Class<? extends T>
                                                 clazz
        ) {
            List<InputPart> inputPart =
                    form
                            .get(
                                    nome
                            );
            if (inputPart == null || inputPart.isEmpty()) return null;
            try {
                return inputPart.get(0).getBody(
                        clazz
                        , null);
            } catch (IOException
                    e
            ) {
                e
                        .printStackTrace();
                throw new AssineOnlineException("Problemas para ler o inputpart");
            }
        }
    }


}
