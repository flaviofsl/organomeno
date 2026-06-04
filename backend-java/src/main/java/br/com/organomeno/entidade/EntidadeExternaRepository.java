package br.com.organomeno.entidade;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class EntidadeExternaRepository implements PanacheRepository<EntidadeExterna> {

    public List<EntidadeExterna> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 and ativo = true", idGrupoFamiliar);
    }
}
