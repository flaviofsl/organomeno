package br.com.organomeno.categoria;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class CategoriaRepository implements PanacheRepository<Categoria> {

    public List<Categoria> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 and ativa = true", idGrupoFamiliar);
    }
}

