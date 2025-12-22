package br.com.organomeno.ofx.repository;

import br.com.organomeno.ofx.entity.ArquivoOfxTransacao;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ArquivoOfxTransacaoRepository implements PanacheRepository<ArquivoOfxTransacao> {
    
    public List<ArquivoOfxTransacao> findByArquivoOfxId(Long arquivoOfxId) {
        return find("arquivoOfx.id", arquivoOfxId).list();
    }
}

