package br.com.organomeno.ofx;

import br.com.organomeno.util.UtilFile;
import net.sf.ofx4j.domain.data.MessageSetType;
import net.sf.ofx4j.domain.data.ResponseEnvelope;
import net.sf.ofx4j.domain.data.ResponseMessageSet;
import net.sf.ofx4j.domain.data.banking.BankStatementResponseTransaction;
import net.sf.ofx4j.domain.data.banking.BankingResponseMessageSet;
import net.sf.ofx4j.domain.data.common.Transaction;
import net.sf.ofx4j.domain.data.common.TransactionType;
import net.sf.ofx4j.domain.data.creditcard.CreditCardResponseMessageSet;
import net.sf.ofx4j.domain.data.creditcard.CreditCardStatementResponse;
import net.sf.ofx4j.domain.data.creditcard.CreditCardStatementResponseTransaction;
import net.sf.ofx4j.io.AggregateUnmarshaller;
import net.sf.ofx4j.io.OFXParseException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

public class ImportaArquivo {

    public static void main(String args[])
    {
        try {
        ImportaArquivo fileImportRN = new ImportaArquivo();
        FileInputStream stream = new FileInputStream("/home/flavios/Documentos/projetos/integrador-financeiro/src/main/java/integrador/nubank-2022-07.ofx");
        fileImportRN.importarCartaoCredito(stream, new Date());
        }catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    public void teste(){

        try {
            FileInputStream stream = new FileInputStream("nubank-2020-02.ofx");
            InputStreamReader reader = new InputStreamReader(stream);
            BufferedReader br = new BufferedReader(reader);
            String linha = br.readLine();
            while(linha != null) {
                String nome = linha.substring(0, linha.indexOf('|'));
                String cidade = linha.substring(linha.indexOf('|') + 1, linha.lastIndexOf('|'));
                String compras = linha.substring(linha.lastIndexOf('|') + 1, linha.length());
                System.out.println(nome); System.out.println(cidade);
                System.out.println(compras); linha = br.readLine();
            }
        }catch (Exception e)
        {
            e.printStackTrace();
        }

    }
 

    public void importarCartaoCredito(InputStream inputStream, Date dataVencimentoFatura)
            throws IOException, OFXParseException {
        System.out.println("importarExtratoBancario");

        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        UtilFile.copyFileUsingStream(inputStream, fileSource);
        UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");

        // Verifica se há a indicação de timezone no arquivo
        if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]")) {
            System.out.println("Não tem indicação de time zone");
            // Alterar a time zone para o timezone zero, pois no arquivo não
            // há indicação de timezone nas datas
            // sem isso o ofx4j converte as datas com 3 horas a menos pois
            // essa é a timezone do brasil (-3)
            TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
            // System.out.println("TIME ZONE DEFAULT:
            // "+TimeZone.getDefault());
        }

        AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

        ResponseEnvelope envelope = (ResponseEnvelope) a.unmarshal(new FileInputStream(fileTarget));

        CreditCardResponseMessageSet messageSet = (CreditCardResponseMessageSet) envelope
                .getMessageSet(MessageSetType.creditcard);

        List<CreditCardStatementResponseTransaction> responses = messageSet.getStatementResponses();


        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Finanças");
        sheet.setColumnWidth(0, 6000);
        sheet.setColumnWidth(1, 4000);

        Row header = sheet.createRow(0);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

        XSSFFont font = ((XSSFWorkbook) workbook).createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 16);
        font.setBold(true);
        headerStyle.setFont(font);

        Cell headerCell = header.createCell(0);
        headerCell.setCellValue("ID");
        headerCell.setCellStyle(headerStyle);

        headerCell = header.createCell(1);
        headerCell.setCellValue("TIPO");
        headerCell.setCellStyle(headerStyle);
        headerCell = header.createCell(2);
        headerCell.setCellValue("DATA");
        headerCell.setCellStyle(headerStyle);
        headerCell = header.createCell(3);
        headerCell.setCellValue("DESCRIÇÃO");
        headerCell.setCellStyle(headerStyle);
        headerCell = header.createCell(4);
        headerCell.setCellValue("VALOR");
        headerCell.setCellStyle(headerStyle);

        CellStyle style = workbook.createCellStyle();
        style.setWrapText(true);

        for (CreditCardStatementResponseTransaction response : responses) {

            CreditCardStatementResponse message = response.getMessage();

            System.out.println("NÚMERO DO CARTÃO: " + message.getAccount().getAccountNumber());
            System.out.println("TOTAL: " + message.getLedgerBalance().getAmount());
            System.out.println("DATA DE VENCIMENTO: " + message.getLedgerBalance().getAsOfDate());
            System.out.println("");


            String currencyCode = message.getCurrencyCode();
            List<Transaction> transactions = message.getTransactionList().getTransactions();

            int qtdRegistros = 0;
            for (Transaction transaction : transactions) {

                System.out.println("ID:    " + transaction.getId());
                System.out.println("TIPO:  " + transaction.getTransactionType());
                System.out.println("DATA:  " + new SimpleDateFormat("dd/MM/yyyy").format(transaction.getDatePosted()));
                System.out.println("MEMO   " + transaction.getMemo());
                System.out.println("VALOR: " + transaction.getAmount() + " " + currencyCode);
                System.out.println("");
                System.out.println("-------------------------------------------------------------- ");

                Row row = sheet.createRow(qtdRegistros+1);
                Cell cell = row.createCell(0);
                cell.setCellValue(transaction.getId());
                cell.setCellStyle(style);
                cell = row.createCell(1);
                cell.setCellValue(transaction.getTransactionType()+"");
                cell.setCellStyle(style);
                cell = row.createCell(2);
                cell.setCellValue(new SimpleDateFormat("dd/MM/yyyy").format(transaction.getDatePosted())+"");
                cell.setCellStyle(style);
                cell = row.createCell(3);
                cell.setCellValue(transaction.getMemo()+"");
                cell.setCellStyle(style);
                cell = row.createCell(4);
                cell.setCellValue((transaction.getAmount().toString().replace("-","")));
                cell.setCellStyle(style);

                qtdRegistros++;
            }

            System.out.println("QUANTIDADE: " + qtdRegistros);
        }

        File currDir = new File(".");
        String path = currDir.getAbsolutePath();
        String fileLocation = path.substring(0, path.length() - 1) + "temp.xlsx";

        try {
            FileOutputStream outputStream = new FileOutputStream(fileLocation);
            workbook.write(outputStream);
            workbook.close();
        }catch (Exception e)
        {
            e.printStackTrace();
        }

        fileTarget.delete();
        fileSource.delete();

    }

//    private boolean possueValoresIguais(List<Transaction> transactions, Lancamento lancamento) {
//        int qtd = 0;
//        for (Transaction transaction : transactions) {
//            if (transaction.getBigDecimalAmount().compareTo(lancamento.getValor()) == 0
//                    && transaction.getDatePosted().equals(lancamento.getData())) {
//                qtd++;
//            }
//        }
//
//        return qtd > 1;
//
//    }

    public void importarExtratoBancario(InputStream inputStream) throws IOException, OFXParseException {
        System.out.println("importarExtratoBancario");

        File fileSource = File.createTempFile("fileSourceOFX", ".ofx");
        File fileTarget = File.createTempFile("fileTargetOFX", ".ofx");

        UtilFile.copyFileUsingStream(inputStream, fileSource);
        UtilFile.changeEncoding(fileSource, "ISO-8859-1", fileTarget, "UTF-8");

        // Verifica se há a indicação de timezone no arquivo
        if (!UtilFile.arquivoPossuiTexto(fileTarget, "[-3:BRT]")) {
            System.out.println("Não tem indicação de time zone");
            // Alterar a time zone para o timezone zero, pois no arquivo não
            // há indicação de timezone nas datas
            // sem isso o ofx4j converte as datas com 3 horas a menos pois
            // essa é a timezone do brasil (-3)
            TimeZone.setDefault(TimeZone.getTimeZone("BRT"));
            // System.out.println("TIME ZONE DEFAULT:
            // "+TimeZone.getDefault());
        }

        AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<ResponseEnvelope>(ResponseEnvelope.class);

        ResponseEnvelope re = (ResponseEnvelope) a.unmarshal(new FileInputStream(fileTarget));

        ResponseMessageSet messageSet = re.getMessageSet(MessageSetType.banking);

        if (messageSet != null) {
            List<BankStatementResponseTransaction> bank = ((BankingResponseMessageSet) messageSet)
                    .getStatementResponses();

            for (BankStatementResponseTransaction b : bank) {

                System.out.println("Código do Banco: " + b.getMessage().getAccount().getBankId());
                System.out.println("Conta: " + b.getMessage().getAccount().getAccountNumber());
                System.out.println("Agência: " + b.getMessage().getAccount().getBranchId());
                System.out.println("Balanço Final: " + b.getMessage().getLedgerBalance().getAmount());
                System.out.println("Data do Arquivo: " + b.getMessage().getLedgerBalance().getAsOfDate());

                List<Transaction> list = b.getMessage().getTransactionList().getTransactions();

//                Conta contaBancaria = new Conta();
//                contaBancaria.setNome("Conta Banc�ria - " + b.getMessage().getAccount().getAccountNumber());
//                contaBancaria.setBancoCodigo(b.getMessage().getAccount().getBankId());
//                contaBancaria.setAgenciaNumero(b.getMessage().getAccount().getBranchId());
//                contaBancaria.setContaNumero(b.getMessage().getAccount().getAccountNumber());
//                contaBancaria.setTipo(ContaTipoEnum.CHECKING_ACCOUNT);
//                contaBancaria.setContaApp(userSession.getContaApp());
//                contaBancaria.setCreatedAt(new Date());
//                contaBancaria.setUpdatedAt(new Date());
//                contaBancaria.setCodigo(GeradorCodigo.gerar());
//                contaBancaria.setLancamentoManual(false);
//
//                List<Conta> listaContas = contaRN.findByContaAndBanco(contaBancaria);
//                if (listaContas.size() == 0) {
//                    contaRN.insert(contaBancaria);
//                    System.out.println("==> CONTA INSERIDA");
//
//                } else {
//                    contaBancaria = listaContas.get(0);
//
//                    System.out.println("==> CONTA NÃO INSERIDA");
//
//                }
                System.out.println("--------------------------------------------------");

                int qtdRegistros = 0;

                for (Transaction transaction : list) {
                    System.out.println("TIPO:      " + transaction.getTransactionType().name());
                    System.out.println("ID:        " + transaction.getId());
                    System.out.println("DOCUMENTO: " + transaction.getReferenceNumber());
                    System.out.println(
                            "DATA:      " + new SimpleDateFormat("dd/MM/yyyy").format(transaction.getDatePosted()));
                    System.out.println("DATA:      " + transaction.getDatePosted());
                    System.out.println("VALOR:     " + transaction.getBigDecimalAmount());
                    System.out.println("DESCRIÇÃO: " + transaction.getMemo());

//                    Lancamento lancamento = new Lancamento();
//                    lancamento.setCategorizado(false);
//                    lancamento.setContaApp(userSession.getContaApp());
//                    lancamento.setConta(contaBancaria);
//                    lancamento.setData(transaction.getDatePosted());
//                    lancamento.setDataPagamento(transaction.getDatePosted());
//                    lancamento.setMemo(transaction.getMemo());
//                    lancamento.setCreatedAt(new Date());
//                    lancamento.setUpdatedAt(new Date());
//                    lancamento.setCodigo(GeradorCodigo.gerar());
//                    lancamento.setTransactionId(transaction.getId());
//                    lancamento.setValor(transaction.getBigDecimalAmount());
//
//                    if (transaction.getBigDecimalAmount().signum() == -1) {
//                        lancamento.setTipoES(LancamentoTipoEnum.S);
//                    } else {
//                        lancamento.setTipoES(LancamentoTipoEnum.E);
//                    }
//
//                    List<Padrao> padroes = padraoRN.findByMemo(lancamento.getMemo(), userSession.getContaApp());
//                    for (Padrao padrao : padroes) {
//                        lancamento.setTipo(padrao.getTipo());
//                        lancamento.setValorConsiderado(padrao.isValorConsiderado());
//                    }
//
//                    List<Lancamento> listaLancamentos = lancamentoRN.findByMemoAndTransactionIdAndContaApp(lancamento);
//                    if (listaLancamentos.size() == 0) {
//                        lancamentoRN.insert(lancamento);
//                        qtdRegistros++;
//                        System.out.println("==> INSERIDO");
//                    } else {
//                        System.out.println("==> NÃO INSERIDO");
//                    }

                    System.out.println("-------------------------------------------------------------- ");

                }

                System.out.println("QUANTIDADE: " + qtdRegistros);
            }
        }

        fileTarget.delete();
        fileSource.delete();

    }
}
