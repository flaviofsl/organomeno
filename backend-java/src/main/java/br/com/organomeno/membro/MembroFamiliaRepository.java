package br.com.organomeno.membro;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class MembroFamiliaRepository implements PanacheRepository<MembroFamilia> {

    public List<MembroFamilia> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 and ativo = true", idGrupoFamiliar);
    }
}
