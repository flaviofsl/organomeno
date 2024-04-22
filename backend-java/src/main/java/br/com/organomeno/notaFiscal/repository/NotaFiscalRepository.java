package br.com.organomeno.notaFiscal.repository;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NotaFiscalRepository implements PanacheRepositoryBase<NotaFiscal,Integer> {

}
