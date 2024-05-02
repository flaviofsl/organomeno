package br.com.organomeno.despesas.repository;


import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.*;

@ApplicationScoped
public class DespesasRepository implements PanacheRepositoryBase<Despesas,Integer> {

    public List<Despesas> encontrarDespesasPorCategoria(String categoria){
        return find("categoria = ?1", categoria).list();
    }
    public List<Despesas> encontrarDespesasPorNota(NotaFiscalDTO notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).list();
    }
    public List<Despesas> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO){
        StringJoiner query = new StringJoiner(" ");
        query.add("FROM Despesas d WHERE");
        query.add("(:categoria IS NULL OR d.categoria = :categoria)");
        query.add("AND (:descricao IS NULL OR d.descricao = :descricao)");
        query.add("AND (:valorBruto IS NULL OR d.valorBruto = :valorBruto)");
        query.add("AND (:dataCadastro IS NULL OR d.dataCadastro = :dataCadastro)");
        query.add("AND (:notaFiscal IS NULL OR d.notaFiscal.id = :notaFiscal)");

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("categoria", despesasFiltroDTO.getCategoria());
        parametros.put("descricao", despesasFiltroDTO.getDescricao());
        parametros.put("valorBruto", despesasFiltroDTO.getValorBruto());
        parametros.put("dataCadastro", despesasFiltroDTO.getDataCadastro());
        parametros.put("notaFiscal", despesasFiltroDTO.getNotaFiscal());

        PanacheQuery<Despesas> despesas = find(query.toString(),parametros);

        if (despesasFiltroDTO.getPageNum() != null || despesasFiltroDTO.getPageSize() != null) {
            despesas.page(Page.of(despesasFiltroDTO.getPageNum(), despesasFiltroDTO.getPageSize()));
            return despesas.stream().toList();
        }
        return despesas.stream().toList();
    }

    public Despesas findByFitId(String fitId){
        return find("fitId = ?1", fitId).firstResult();
    }

}
