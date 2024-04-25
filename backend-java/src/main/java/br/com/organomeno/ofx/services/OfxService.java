package br.com.organomeno.ofx.services;

import com.webcohesion.ofx4j.io.OFXParseException;
import jakarta.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;

public interface OfxService {

    Response fazerLeituraDeOFX(InputStream inputStreamOFX) throws IOException, OFXParseException;

}
