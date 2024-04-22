package br.com.organomeno.notaFiscal.itensNotaFiscal.repository;

import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
@ApplicationScoped
public class ItensNotaFiscalRepository implements PanacheRepositoryBase<ItensNotaFiscal, Integer>{

    public List<ItensNotaFiscal> buscarItensPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }

}
