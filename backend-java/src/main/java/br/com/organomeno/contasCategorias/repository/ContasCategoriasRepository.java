package br.com.organomeno.contasCategorias.repository;
import br.com.organomeno.contasCategorias.entity.ContasCategorias;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ContasCategoriasRepository implements PanacheRepositoryBase<ContasCategorias,Integer> {

}
