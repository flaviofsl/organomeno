package br.com.organomeno.receitas;

import br.com.organomeno.notaFiscal.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
@ApplicationScoped
public class ReceitasRepository implements PanacheRepositoryBase<Receitas,Integer> {

    public List<Receitas> buscarReceitasPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }
}
