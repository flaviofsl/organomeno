package br.com.organomeno.ofx.services;

import br.com.organomeno.ofx.entity.PreviewOfxDTO;
import br.com.organomeno.ofx.entity.ResultadoImportacaoOfxDTO;
import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import com.webcohesion.ofx4j.io.OFXParseException;

import java.io.IOException;

public interface OfxService {

    PreviewOfxDTO previewOfx(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException;

    ResultadoImportacaoOfxDTO importarOfx(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException;
}
