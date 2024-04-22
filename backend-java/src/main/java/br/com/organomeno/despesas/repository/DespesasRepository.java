package br.com.organomeno.despesas.repository;

import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
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

    public List<Despesas> encontrarDespesasPorCategoria(ContasCategoriasDTO contasCategoriasDTO){
        return find("categoria = ?1", contasCategoriasDTO).list();
    }
    public List<Despesas> encontrarDespesasPorNota(NotaFiscalDTO notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).list();
    }
    public List<Despesas> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO){
        StringJoiner query = new StringJoiner(" ");
        query.add("FROM Despesas d WHERE");
        query.add("(:categoria IS NULL OR d.categoria.id = :categoria)");
        query.add("AND (:descricao IS NULL OR d.descricao = :descricao)");
        query.add("AND (:valorBruto IS NULL OR d.valorBruto = :valorBruto)");
        query.add("AND (:valorLiquido IS NULL OR d.valorLiquido = :valorLiquido)");
        query.add("AND (:vencimento IS NULL OR d.vencimento = :vencimento)");
        query.add("AND (:notaFiscal IS NULL OR d.notaFiscal.id = :notaFiscal)");
        query.add("ORDER BY d.dataCadastro DESC");

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("categoria", despesasFiltroDTO.getCategoria());
        parametros.put("descricao", despesasFiltroDTO.getDescricao());
        parametros.put("valorBruto", despesasFiltroDTO.getValorBruto());
        parametros.put("valorLiquido", despesasFiltroDTO.getValorLiquido());
        parametros.put("vencimento", despesasFiltroDTO.getVencimento());
        parametros.put("notaFiscal", despesasFiltroDTO.getNotaFiscal());

        PanacheQuery<Despesas> despesas = find(query.toString(),parametros);
        if (despesasFiltroDTO.getPageNum() == null && despesasFiltroDTO.getPageSize() == null){
            despesas.page(Page.of(0, 20));
            return despesas.stream().toList();
        }
        despesas.page(Page.of(despesasFiltroDTO.getPageNum(), despesasFiltroDTO.getPageSize()));
        return despesas.stream().toList();
    }

}
