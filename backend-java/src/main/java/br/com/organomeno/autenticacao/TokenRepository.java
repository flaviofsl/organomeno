package br.com.organomeno.autenticacao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class TokenRepository implements PanacheRepository<TokenRecuperacaoSenha> {

    public Optional<TokenRecuperacaoSenha> findByToken(String token) {
        return find("token = ?1", token).firstResultOptional();
    }
}
