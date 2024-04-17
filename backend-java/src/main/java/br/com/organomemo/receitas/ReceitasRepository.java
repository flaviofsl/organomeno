package br.com.organomemo.receitas;

import br.com.organomemo.notaFiscal.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

import java.util.List;

public class ReceitasRepository implements PanacheRepositoryBase<ReceitasDTO,Integer> {

    public List<ReceitasDTO> buscarReceitasPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }
}
