package br.com.organomeno.scrapNotaFiscal;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.scrapNotaFiscal.layouts.LayoutDefault;
import br.com.organomeno.scrapNotaFiscal.layouts.LayoutSendas;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.text.ParseException;

public class IdentificadorLayout {
    private Document document;

    public IdentificadorLayout(Document document) {
        this.document = document;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public NotaFiscalDTO getLayout() throws Exception {
        Elements divContent = document.select("div.ui-content");

        if (divContent.hasAttr("xmlns:n") && divContent.hasAttr("xmlns:chave")) {
            LayoutSendas layoutSendas = new LayoutSendas(document);
            return layoutSendas.getItem();
        } else {
            LayoutDefault layoutDefault = new LayoutDefault(document);
            return layoutDefault.getItem();
        }
    }
}
