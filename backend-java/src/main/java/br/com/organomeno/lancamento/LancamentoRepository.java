package br.com.organomeno.lancamento;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class LancamentoRepository implements PanacheRepository<Lancamento> {

    public List<Lancamento> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 order by dataTransacao desc", idGrupoFamiliar);
    }

    public List<Lancamento> findByGrupoETipo(Long idGrupoFamiliar, String tipo) {
        return list("grupoFamiliar.id = ?1 and tipo = ?2 order by dataTransacao desc",
                idGrupoFamiliar, tipo);
    }

    public List<Lancamento> findByGrupoEPeriodo(Long idGrupoFamiliar, LocalDate inicio, LocalDate fim) {
        return list("grupoFamiliar.id = ?1 and dataTransacao >= ?2 and dataTransacao <= ?3 order by dataTransacao desc",
                idGrupoFamiliar, inicio, fim);
    }

    public List<Lancamento> findRecentes(Long idGrupoFamiliar, int limite) {
        return find("grupoFamiliar.id = ?1 order by dataCadastro desc", idGrupoFamiliar)
                .page(0, limite)
                .list();
    }
}
