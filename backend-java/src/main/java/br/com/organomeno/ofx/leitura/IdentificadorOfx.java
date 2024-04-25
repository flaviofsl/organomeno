package br.com.organomeno.ofx.leitura;

import br.com.organomeno.util.UtilFile;
import com.webcohesion.ofx4j.domain.data.MessageSetType;
import com.webcohesion.ofx4j.domain.data.ResponseEnvelope;
import com.webcohesion.ofx4j.io.AggregateUnmarshaller;
import com.webcohesion.ofx4j.io.OFXParseException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;


public class IdentificadorOfx {

    public MessageSetType identificadorMessageType(InputStream inputStream) throws IOException, OFXParseException {

        AggregateUnmarshaller<ResponseEnvelope> unmarshaller = new AggregateUnmarshaller<>(ResponseEnvelope.class);
        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        UtilFile.copyFileUsingStream(inputStream, fileSource);
        UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");

        try {
            ResponseEnvelope envelope = (ResponseEnvelope) unmarshaller.unmarshal(new FileInputStream(fileTarget));

            if (envelope == null){
                throw new OFXParseException("Formato inválido");
            }
            if(envelope.getMessageSet(MessageSetType.creditcard) != null){
                return MessageSetType.creditcard;
            } else if (envelope.getMessageSet(MessageSetType.banking) != null) {
                return MessageSetType.banking;
            } else {
                throw new OFXParseException("MessageType não encontrado");
            }

        } catch (OFXParseException e){
            throw e;
        } catch (Exception e){
            throw new OFXParseException(e);
        }

    }
}
