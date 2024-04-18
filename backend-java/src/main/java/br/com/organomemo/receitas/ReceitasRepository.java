package br.com.organomemo.receitas;

import br.com.organomemo.notaFiscal.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
@ApplicationScoped
public class ReceitasRepository implements PanacheRepositoryBase<ReceitasDTO,Integer> {

    public List<ReceitasDTO> buscarReceitasPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }
}
