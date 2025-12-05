package br.com.organomeno.movimentacao;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LivroMovimentacaoRepository implements PanacheRepository<LivroMovimentacao> {
}

