package br.com.organomemo.contasCategorias;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ContasCategoriasRepository implements PanacheRepositoryBase<ContasCategorias,Integer> {

}
