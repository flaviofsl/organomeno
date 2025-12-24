package br.com.organomeno.ofx.leitura;

import br.com.organomeno.conta.Conta;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.movimentacao.LivroMovimentacao;
import br.com.organomeno.movimentacao.LivroMovimentacaoRepository;
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

        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        try {
            UtilFile.copyFileUsingStream(inputStream, fileSource);
            // Tenta primeiro Windows-1252 (CHARSET:1252), depois ISO-8859-1
            try {
                UtilFile.changeEncoding(fileSource, "Windows-1252", fileTarget, "UTF-8");
            } catch (Exception e) {
                UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");
            }

            // Verifica se há a indicação de timezone no arquivo
            if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]") && !UtilFile.arquivoPossuiTexto(fileTarget, "[-3:GMT]")) {
                TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
            }

            AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

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
        } finally {
            // Limpar arquivos temporários
            if (fileSource.exists()) {
                fileSource.delete();
            }
            if (fileTarget.exists()) {
                fileTarget.delete();
            }
        }
    }


    public ResultadoImportacao importarCartaoCredito(InputStream inputStream)
            throws IOException, OFXParseException {

        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        try {
            System.out.println("Iniciando importação de cartão de crédito...");
            UtilFile.copyFileUsingStream(inputStream, fileSource);
            System.out.println("Arquivo copiado para: " + fileSource.getAbsolutePath());
            
            // Tenta primeiro Windows-1252 (CHARSET:1252), depois ISO-8859-1
            try {
                UtilFile.changeEncoding(fileSource, "Windows-1252", fileTarget, "UTF-8");
                System.out.println("Encoding convertido usando Windows-1252. Arquivo destino: " + fileTarget.getAbsolutePath());
            } catch (Exception e) {
                System.out.println("Falha ao converter com Windows-1252, tentando ISO-8859-1: " + e.getMessage());
                UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");
                System.out.println("Encoding convertido usando ISO-8859-1. Arquivo destino: " + fileTarget.getAbsolutePath());
            }

            // Verifica se há a indicação de timezone no arquivo
            if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]") && !UtilFile.arquivoPossuiTexto(fileTarget, "[-3:GMT]")) {
                System.out.println("Timezone não encontrado, configurando BRT");
                TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
            } else {
                System.out.println("Timezone encontrado no arquivo");
            }

            AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

            System.out.println("Iniciando unmarshal do arquivo OFX...");
            ResponseEnvelope envelope = (ResponseEnvelope) a.unmarshal(new FileInputStream(fileTarget));
            System.out.println("Unmarshal concluído. Envelope: " + (envelope != null ? "OK" : "NULL"));

            if (envelope == null) {
                throw new OFXParseException("Failed to parse OFX file: Envelope is null");
            }

            CreditCardResponseMessageSet messageSet = (CreditCardResponseMessageSet) envelope
                    .getMessageSet(MessageSetType.creditcard);

            System.out.println("MessageSet: " + (messageSet != null ? "OK" : "NULL"));

            if (messageSet == null) {
                throw new OFXParseException("OFX não possui dados de cartão de crédito.");
            }

            List<CreditCardStatementResponseTransaction> responses = messageSet.getStatementResponses();
            System.out.println("Número de responses: " + (responses != null ? responses.size() : 0));

            List<ReceitasDTO> listaReceita = new ArrayList<>();
            List<DespesasDTO> listaDespesas = new ArrayList<>();

            if (responses != null) {
                for (CreditCardStatementResponseTransaction response : responses) {
                    CreditCardStatementResponse message = response.getMessage();
                    if (message != null && message.getTransactionList() != null) {
                        List<Transaction> transactions = message.getTransactionList().getTransactions();
                        System.out.println("Número de transações encontradas: " + (transactions != null ? transactions.size() : 0));
                        
                        if (transactions != null && !transactions.isEmpty()) {
                            inserirTransacao(listaReceita, listaDespesas, transactions);
                        }
                    } else {
                        System.out.println("Aviso: message ou transactionList é null");
                    }
                }
            }

            System.out.println("Total de receitas: " + listaReceita.size());
            System.out.println("Total de despesas: " + listaDespesas.size());

            return new ResultadoImportacao(listaReceita, listaDespesas);
        } catch (OFXParseException e) {
            System.err.println("Erro ao fazer parse do OFX: " + e.getMessage());
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            System.err.println("Erro inesperado ao processar cartão de crédito: " + e.getMessage());
            e.printStackTrace();
            throw new OFXParseException("Failed to parse Cartao de Credito: " + e.getMessage(), e);
        } finally {
            // Limpar arquivos temporários
            if (fileSource.exists()) {
                fileSource.delete();
            }
            if (fileTarget.exists()) {
                fileTarget.delete();
            }
        }
    }


    private void inserirTransacao(List<ReceitasDTO> listaReceita, List<DespesasDTO> listaDespesas, List<Transaction> transactions) {
        for (Transaction transaction : transactions) {

            if (String.valueOf(transaction.getAmount()).contains("-")) {
                DespesasDTO despesa = new DespesasDTO();

                despesa.setDescricao(transaction.getMemo());
                despesa.setValorBruto(transaction.getAmount());
                despesa.setDataCadastro(transaction.getDatePosted());
                despesa.setCategoria(String.valueOf(transaction.getTransactionType()));
                despesa.setFitId(transaction.getId());
                listaDespesas.add(despesa);
            } else {
                ReceitasDTO receita = new ReceitasDTO();

                receita.setDescricao(transaction.getMemo());
                receita.setValorBruto(transaction.getAmount());
                receita.setDataEntrada(transaction.getDatePosted());

                receita.setFitId(transaction.getId());
                listaReceita.add(receita);
            }
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
