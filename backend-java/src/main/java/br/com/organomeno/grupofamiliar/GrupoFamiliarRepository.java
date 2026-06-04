package br.com.organomeno.grupofamiliar;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class GrupoFamiliarRepository implements PanacheRepository<GrupoFamiliar> {
}
