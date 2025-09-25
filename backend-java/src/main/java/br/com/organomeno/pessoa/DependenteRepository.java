package br.com.organomeno.pessoa;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class DependenteRepository implements PanacheRepository<Dependente> {

    public List<Dependente> listarPorResponsavel(Long responsavelId) {
        return list("responsavel.id", responsavelId);
    }

    public Optional<Dependente> buscarPorResponsavelEDependente(Long responsavelId, Long dependenteId) {
        return find("responsavel.id = ?1 and pessoa.id = ?2", responsavelId, dependenteId).firstResultOptional();
    }
}
