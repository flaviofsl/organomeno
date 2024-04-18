package br.com.organomemo.notaFiscal;

import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NotaFiscalRepository implements PanacheRepositoryBase<NotaFiscal,Integer> {


}
