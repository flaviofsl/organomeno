package br.com.organomeno.ofx.leitura;

import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.ofx.rest.MulitipleDocumentDetailsRequest;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.util.UtilFile;
import com.webcohesion.ofx4j.domain.data.MessageSetType;
import com.webcohesion.ofx4j.domain.data.ResponseEnvelope;
import com.webcohesion.ofx4j.domain.data.ResponseMessageSet;
import com.webcohesion.ofx4j.domain.data.banking.BankStatementResponseTransaction;
import com.webcohesion.ofx4j.domain.data.banking.BankingResponseMessageSet;
import com.webcohesion.ofx4j.domain.data.common.Transaction;
import com.webcohesion.ofx4j.domain.data.creditcard.CreditCardResponseMessageSet;
import com.webcohesion.ofx4j.domain.data.creditcard.CreditCardStatementResponse;
import com.webcohesion.ofx4j.domain.data.creditcard.CreditCardStatementResponseTransaction;
import com.webcohesion.ofx4j.io.AggregateUnmarshaller;
import com.webcohesion.ofx4j.io.OFXParseException;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.TimeZone;


public class LeitorDeOfx {

    public ResultadoImportacao importarExtratoBancario(InputStream inputStream) throws IOException, OFXParseException {

        AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

        try {
            // Cria arquivos temporários
            File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
            File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

            // Copia o InputStream para um arquivo temporário
            UtilFile.copyFileUsingStream(inputStream, fileSource);

            // Converte a codificação do arquivo temporário
            UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");

            // Verifica se o arquivo possui indicação de time zone
            if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]")) {
                System.out.println("Não tem indicação de time zone");
                TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
            }

            // Realiza o unmarshal no arquivo convertido
            ResponseEnvelope re = (ResponseEnvelope) a.unmarshal(new FileInputStream(fileTarget));

            ResponseMessageSet messageSet = re.getMessageSet(MessageSetType.banking);

            List<BankStatementResponseTransaction> bank = ((BankingResponseMessageSet) messageSet)
                    .getStatementResponses();

            List<ReceitasDTO> listaReceita = new ArrayList<>();
            List<DespesasDTO> listaDespesas = new ArrayList<>();

            for (BankStatementResponseTransaction b : bank) {

                List<Transaction> list = b.getMessage().getTransactionList().getTransactions();

                inserirTransacao(listaReceita, listaDespesas, list);
            }


            return new ResultadoImportacao(listaReceita, listaDespesas);
        } catch (OFXParseException e) {
            throw e;
        } catch (Exception e) {
            throw new OFXParseException("Failed to parse Extrato Bancario." + e);
        }
    }


    public ResultadoImportacao importarCartaoCredito(InputStream inputStream)
            throws IOException, OFXParseException {

        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        UtilFile.copyFileUsingStream(inputStream, fileSource);
        UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");

        if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]")) {
            System.out.println("Não tem indicação de time zone");
            TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
        }

        AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

        ResponseEnvelope envelope = (ResponseEnvelope) a.unmarshal(new FileInputStream(fileTarget));

        CreditCardResponseMessageSet messageSet = (CreditCardResponseMessageSet) envelope
                .getMessageSet(MessageSetType.creditcard);

        List<CreditCardStatementResponseTransaction> responses = messageSet.getStatementResponses();

        try {

            if (envelope == null) {
                throw new OFXParseException("Failed to parse OFX file: Envelope is null");
            }



            if (messageSet == null) {
                throw new OFXParseException("OFX não possui dados de cartão de crédito.");
            }


            List<ReceitasDTO> listaReceita = new ArrayList<>();
            List<DespesasDTO> listaDespesas = new ArrayList<>();

            for (CreditCardStatementResponseTransaction response : responses) {
                CreditCardStatementResponse message = response.getMessage();
                List<Transaction> transactions = message.getTransactionList().getTransactions();

                inserirTransacao(listaReceita, listaDespesas, transactions);
            }

            return new ResultadoImportacao(listaReceita, listaDespesas);
        } catch (OFXParseException e) {
            throw e;
        } catch (Exception e) {
            throw new OFXParseException("Failed to parse Cartao de Credito.", e);
        }
    }


    private void inserirTransacao(List<ReceitasDTO> listaReceita, List<DespesasDTO> listaDespesas, List<Transaction> transactions) {
        for (Transaction transaction : transactions) {

            if (transaction.getAmount() < 0) {
                DespesasDTO despesa = new DespesasDTO();
                ContasCategoriasDTO categoria = new ContasCategoriasDTO();

                despesa.setDescricao(transaction.getMemo());
                despesa.setValorBruto(transaction.getAmount());
                despesa.setDataCadastro(transaction.getDatePosted());
                categoria.setDescricao(transaction.getTransactionType().name());
                despesa.setCategoria(categoria);
                despesa.setFitId(transaction.getId());
                listaDespesas.add(despesa);
            }

            ReceitasDTO receita = new ReceitasDTO();
            ContasCategoriasDTO categoria = new ContasCategoriasDTO();

            receita.setDescricao(transaction.getMemo());
            receita.setValorBruto(transaction.getAmount());
            receita.setDataEntrada(transaction.getDatePosted());
            categoria.setDescricao(transaction.getTransactionType().name());
            receita.setFitId(transaction.getId());
            listaReceita.add(receita);
        }
    }


    public ResultadoImportacao importarOFX(MulitipleDocumentDetailsRequest documentDetailsRequests) throws IOException, OFXParseException {
        IdentificadorOfx identificadorOfx = new IdentificadorOfx();


        MessageSetType messageType = identificadorOfx.identificadorMessageType(documentDetailsRequests );

        if (messageType == MessageSetType.creditcard) {
            InputStream inputStream = new FileInputStream(documentDetailsRequests.getFileUpload().get(0).uploadedFile().toString() );

            return importarCartaoCredito(inputStream);
        } else if (messageType == MessageSetType.banking) {
            InputStream inputStream = new FileInputStream(documentDetailsRequests.getFileUpload().get(0).uploadedFile().toString() );

            return importarExtratoBancario(inputStream);
        } else {
            throw new OFXParseException("MessageType não encontrado.");
        }
    }


    public static class ResultadoImportacao {
        private List<ReceitasDTO> listaReceita;
        private List<DespesasDTO> listaDespesas;

        public ResultadoImportacao(List<ReceitasDTO> listaReceita, List<DespesasDTO> listaDespesas) {
            this.listaReceita = listaReceita;
            this.listaDespesas = listaDespesas;
        }

        public List<ReceitasDTO> getListaReceita() {
            return listaReceita;
        }

        public List<DespesasDTO> getListaDespesas() {
            return listaDespesas;
        }
    }
}
