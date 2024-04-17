package br.com.organomemo.itensNotaFiscal;

import br.com.organomemo.notaFiscal.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;

import java.util.List;

public class ItensNotaFiscalRepository implements PanacheRepositoryBase<ItensNotaFiscalDTO, Integer>{

    public List<ItensNotaFiscalDTO> buscarItensPorNota(NotaFiscal notaFiscal){
        return find("notaFiscal = ?1", notaFiscal).stream().toList();
    }

}
