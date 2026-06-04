package br.com.organomeno.autenticacao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class UsuarioRepository implements PanacheRepository<Usuario> {

    public Optional<Usuario> findByEmail(String email) {
        return find("email = ?1 and ativo = true", email).firstResultOptional();
    }

    public boolean existsByEmail(String email) {
        return count("email = ?1", email) > 0;
    }
}
