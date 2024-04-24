package br.com.organomeno.ofx.services;

import br.com.organomeno.ofx.LeitorDeOFX;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import net.sf.ofx4j.io.OFXParseException;

import java.io.IOException;
import java.io.InputStream;

@ApplicationScoped
public class OFXServiceImpl implements OFXService{

    @Override
    public Response fazerLeituraDeOFX(InputStream inputStreamOFX) throws IOException, OFXParseException {
        LeitorDeOFX leitorDeOFX = new LeitorDeOFX();
        leitorDeOFX.importarCartaoCredito(inputStreamOFX);
        return null;
    }
}
