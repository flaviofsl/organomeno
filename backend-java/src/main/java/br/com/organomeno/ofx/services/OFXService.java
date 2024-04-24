package br.com.organomeno.ofx.services;

import jakarta.ws.rs.core.Response;
import net.sf.ofx4j.io.OFXParseException;

import java.io.IOException;
import java.io.InputStream;

public interface OFXService {
    Response fazerLeituraDeOFX(InputStream inputStreamOFX) throws IOException, OFXParseException;
}
