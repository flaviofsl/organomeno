package br.com.organomeno.conta;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ContaRepository implements PanacheRepository<Conta> {

    public List<Conta> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 and ativa = true", idGrupoFamiliar);
    }

    public List<Conta> findByGrupoEAtiva(Long idGrupoFamiliar, Boolean ativa) {
        if (ativa == null) {
            return findByGrupo(idGrupoFamiliar);
        }
        return list("grupoFamiliar.id = ?1 and ativa = ?2", idGrupoFamiliar, ativa);
    }
}

