package br.com.organomeno.despesas.repository;

import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.notaFiscal.NotaFiscalDTO;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.*;

@ApplicationScoped
public class DespesasRepository implements PanacheRepositoryBase<Despesas,Integer> {

    public List<Despesas> encontrarDespesasPorCategoria(ContasCategoriasDTO contasCategoriasDTO){
        return find("categoria = ?1", contasCategoriasDTO).stream().toList();
    }
    public List<Despesas> encontrarDespesasPorNota(NotaFiscalDTO notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }
    public List<Despesas> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO){
        StringJoiner query = new StringJoiner(" ");
        query.add("(:categoria IS NULL OR categoria.id = :categoria)");
        query.add("AND (:descricao IS NULL OR descricao = :descricao)");
        query.add("AND (:valorBruto IS NULL OR valorBruto = :valorBruto)");
        query.add("AND (:valorLiquido IS NULL OR valorLiquido = :valorLiquido");
        query.add("AND (:vencimento IS NULL OR vencimento = :vencimento");
        query.add("AND (:notaFiscal IS NULL OR notaFiscal.id = :notaFiscal");

        Map<String, Object> parametros = new HashMap<>();
        parametros.put("categoria", despesasFiltroDTO.getCategoria());
        parametros.put("descricao", despesasFiltroDTO.getDescricao());
        parametros.put("valorBruto", despesasFiltroDTO.getValorBruto());
        parametros.put("valorLiquido", despesasFiltroDTO.getValorLiquido());
        parametros.put("vencimento", despesasFiltroDTO.getVencimento());
        parametros.put("notaFiscal", despesasFiltroDTO.getNotaFiscal());

        query.add("ORDER BY dataCadastro DESC");

        PanacheQuery<Despesas> despesas = find(query.toString(),parametros);

        return despesas.list();
    }

}
