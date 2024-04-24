package br.com.organomeno.ofx.leitura;

import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import net.sf.ofx4j.domain.data.MessageSetType;
import net.sf.ofx4j.domain.data.ResponseEnvelope;
import net.sf.ofx4j.domain.data.common.Transaction;
import net.sf.ofx4j.domain.data.creditcard.CreditCardResponseMessageSet;
import net.sf.ofx4j.domain.data.creditcard.CreditCardStatementResponse;
import net.sf.ofx4j.domain.data.creditcard.CreditCardStatementResponseTransaction;
import net.sf.ofx4j.io.AggregateUnmarshaller;
import net.sf.ofx4j.io.OFXParseException;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class LeitorDeOFX {

    public class ResultadoImportacao {
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

    public ResultadoImportacao importarCartaoCredito(InputStream inputStream)
            throws IOException, OFXParseException {

        AggregateUnmarshaller<ResponseEnvelope> a = new AggregateUnmarshaller<>(ResponseEnvelope.class);

        try {
            ResponseEnvelope envelope = a.unmarshal(inputStream);
            CreditCardResponseMessageSet messageSet = (CreditCardResponseMessageSet) envelope
                    .getMessageSet(MessageSetType.creditcard);

            if (messageSet == null) {
                throw new OFXParseException("OFX file does not contain credit card data.");
            }

            List<CreditCardStatementResponseTransaction> responses = messageSet.getStatementResponses();

            List<ReceitasDTO> listaReceita = new ArrayList<>();
            List<DespesasDTO> listaDespesas = new ArrayList<>();

            for (CreditCardStatementResponseTransaction response : responses) {

                CreditCardStatementResponse message = response.getMessage();
                String currencyCode = message.getCurrencyCode();
                List<Transaction> transactions = message.getTransactionList().getTransactions();

                for (Transaction transaction : transactions) {

                    if (transaction.getAmount() < 0){
                        DespesasDTO despesa = new DespesasDTO();
                        ContasCategoriasDTO categoria = new ContasCategoriasDTO();

                        despesa.setDescricao(transaction.getMemo());
                        despesa.setValorBruto(transaction.getAmount());
                        despesa.setDataCadastro(transaction.getDatePosted());
                        categoria.setDescricao(String.valueOf(transaction.getTransactionType()));
                        despesa.setCategoria(categoria);
                        despesa.setFitId(transaction.getId());
                        listaDespesas.add(despesa);
                    }

                    ReceitasDTO receita = new ReceitasDTO();
                    ContasCategoriasDTO categoria = new ContasCategoriasDTO();

                    receita.setDescricao(transaction.getMemo());
                    receita.setValorBruto(transaction.getAmount());
                    receita.setDataEntrada(transaction.getDatePosted());
                    categoria.setDescricao(String.valueOf(transaction.getTransactionType()));
                    receita.setFitId(transaction.getId());
                    listaReceita.add(receita);
                }
            }

            return new ResultadoImportacao(listaReceita,listaDespesas);
        } catch (OFXParseException e) {
            throw e;
        } catch (Exception e) {
            throw new OFXParseException("Failed to parse OFX file.", e);
        } finally {
            inputStream.close();
        }
    }

}
