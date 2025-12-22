package br.com.organomeno.ofx.repository;

import br.com.organomeno.ofx.entity.ArquivoOfx;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ArquivoOfxRepository implements PanacheRepository<ArquivoOfx> {
}

