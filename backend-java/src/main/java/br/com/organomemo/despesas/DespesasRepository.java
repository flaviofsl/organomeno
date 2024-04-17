package br.com.organomemo.despesas;

import br.com.organomemo.contasCategorias.ContasCategorias;
import br.com.organomemo.notaFiscal.NotaFiscal;
import br.com.organomemo.notaFiscal.NotaFiscalDTO;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

import java.util.List;

public class DespesasRepository implements PanacheRepositoryBase<DespesasDTO,Integer> {

    public List<DespesasDTO> encontrarDespesasPorCategoria(ContasCategorias contasCategorias){
        return find("categoria = ?1", contasCategorias).stream().toList();
    }
    public List<DespesasDTO> encontrarDespesasPorNota(NotaFiscalDTO notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }
}
