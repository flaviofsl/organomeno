package br.com.organomeno.movimentacao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class LivroMovimentacaoRepository implements PanacheRepository<LivroMovimentacao> {

    public List<LivroMovimentacao> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 order by dataMovimentacao desc", idGrupoFamiliar);
    }
}

