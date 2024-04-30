package br.com.organomeno.notaFiscal.repository;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

@ApplicationScoped
public class NotaFiscalRepository implements PanacheRepositoryBase<NotaFiscal,Integer> {

    public List<NotaFiscal> filtrarNotasFiscais(NotaFiscalFiltroDTO notaFiscalFiltroDTO){
        StringJoiner query = new StringJoiner(" ");
        query.add("FROM NotaFiscal nf WHERE");
        query.add("(:descricao IS NULL OR nf.descricao = :descricao)");
        query.add("AND (:dataCadastro IS NULL OR nf.dataCadastro = :dataCadastro)");
        query.add("AND (:valorBruto IS NULL OR nf.valorBruto = :valorBruto)");


        Map<String,Object> parametros = new HashMap<>();
        parametros.put("descricao",notaFiscalFiltroDTO.getDescricao());
        parametros.put("dataCadastro", notaFiscalFiltroDTO.getDataCadastro());
        parametros.put("valorBruto", notaFiscalFiltroDTO.getValorBruto());

        PanacheQuery<NotaFiscal> notaFiscal = find(query.toString(),parametros);
        if (notaFiscalFiltroDTO.getPageNum() != null || notaFiscalFiltroDTO.getPageSize() != null) {
            notaFiscal.page(Page.of(notaFiscalFiltroDTO.getPageNum(), notaFiscalFiltroDTO.getPageSize()));
            return notaFiscal.stream().toList();
        }
        notaFiscal.page(Page.of(0, 20));
        return notaFiscal.stream().toList();

    }
}
