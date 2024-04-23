package br.com.organomeno.receitas.repository;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

@ApplicationScoped
public class ReceitasRepository implements PanacheRepositoryBase<Receitas,Integer> {

    public List<Receitas> buscarReceitasPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal.id = ?1", notaFiscal).stream().toList();
    }

    public List<Receitas> filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO){
        StringJoiner query = new StringJoiner(" ");
        query.add("FROM Receitas r WHERE");
        query.add(":descricao IS NULL OR descricao = :descricao");
        query.add("AND (:valorBruto IS NULL OR valorBruto = :valorBruto)");
        query.add("AND (:valorLiquido IS NULL OR valorLiquido = :valorLiquido)");
        query.add("AND (:dataEntrada IS NULL OR dataEntrada = :dataEntrada)");
        query.add("AND (:notaFiscal IS NULL OR notaFiscal.id = :notaFiscal)");

        Map<String,Object> parametros = new HashMap<>();
        parametros.put("descricao", receitasFiltroDTO.getDescricao());
        parametros.put("valorBruto", receitasFiltroDTO.getValorBruto());
        parametros.put("valorLiquido", receitasFiltroDTO.getValorLiquido());
        parametros.put("dataEntrada", receitasFiltroDTO.getDataEntrada());
        parametros.put("notaFiscal", receitasFiltroDTO.getNotaFiscal());

        PanacheQuery<Receitas> receitas = find(query.toString(), parametros);
        if(receitasFiltroDTO.getPageNum() == null && receitasFiltroDTO.getPageSize() == null){
            receitas.page(Page.of(0,20));
            return receitas.stream().toList();
        }
        receitas.page(Page.of(receitasFiltroDTO.getPageNum(), receitasFiltroDTO.getPageSize()));
        return receitas.stream().toList();
    }
}
