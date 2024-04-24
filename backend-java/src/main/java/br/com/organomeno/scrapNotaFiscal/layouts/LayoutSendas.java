package br.com.organomeno.scrapNotaFiscal.layouts;


import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.ItensNotaFiscalDTO;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class LayoutSendas {
    private Document document;

    public LayoutSendas(Document document) {
        this.document = document;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public NotaFiscalDTO getItem() throws ParseException {

        Elements linhas = document.select("table#tabResult tbody tr");
        List<ItensNotaFiscalDTO> itens = new ArrayList<>();
        NotaFiscalDTO notaFiscal = new NotaFiscalDTO();
        notaFiscal.setItensNotaFiscal(itens);

        for (Element linha : linhas) {
            String descricao = linha.select("span.txtTit").text();
            String quantidadeStr = (linha.select("span.Rqtd").text()).trim().replaceAll("\\D+","");
            String unidade = linha.select("span.RUN").text();
            String valorBrutoStr = linha.select("span.valor").text().replaceAll("\\D+","");

            if (!descricao.isEmpty() && !quantidadeStr.isEmpty() && !unidade.isEmpty()
                    && !valorBrutoStr.isEmpty()) {
                ItensNotaFiscalDTO item = new ItensNotaFiscalDTO();

                item.setDescricao(descricao);
                item.setQuantidade(Double.parseDouble(quantidadeStr.replace(',', '.')));
                item.setUnidadeMedida(unidade);
                item.setValorBruto(Double.parseDouble(valorBrutoStr.replace(',', '.')));

                itens.add(item);
            }
        }

        double valorBrutoNota = 0;
        for (ItensNotaFiscalDTO item : itens) {
            valorBrutoNota += item.getValorBruto();
        }
        notaFiscal.setValorBruto(valorBrutoNota);

        notaFiscal.setDataCadastro(new Date());
        notaFiscal.setDescricao("Descrição da Nota Fiscal");

        notaFiscal.setItensNotaFiscal(itens);
        return notaFiscal;

    }
}
