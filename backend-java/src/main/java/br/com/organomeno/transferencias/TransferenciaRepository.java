package br.com.organomeno.transferencias;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class TransferenciaRepository implements PanacheRepository<Transferencia> {

    public List<Transferencia> findByGrupo(Long idGrupoFamiliar) {
        return list("grupoFamiliar.id = ?1 and ativa = true order by dataTransferencia desc", idGrupoFamiliar);
    }

    public List<Transferencia> findByContaOrigem(Integer idContaOrigem) {
        return list("contaOrigem.id", idContaOrigem);
    }

    public List<Transferencia> findByContaDestino(Integer idContaDestino) {
        return list("contaDestino.id", idContaDestino);
    }

    public List<Transferencia> findByContaOrigemOrDestino(Integer idConta) {
        return list("contaOrigem.id = ?1 or contaDestino.id = ?1", idConta);
    }
}
