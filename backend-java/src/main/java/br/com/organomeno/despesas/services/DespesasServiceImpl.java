package br.com.organomeno.despesas.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.notaFiscal.NotaFiscalDTO;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
public class DespesasServiceImpl implements DespesasService {
    @Inject
    DespesasRepository despesasRepository;
    @Inject
    DespesasMapper despesasMapper;

    @Override
    public List<DespesasDTO> buscarTodasAsDespesas() {
        return despesasMapper.toListDTO(despesasRepository.findAll().stream().toList());
    }

    @Override
    public DespesasDTO buscarDespesaPorId(Integer id) {
        return despesasMapper.toDTO(despesasRepository.findById(id));
    }

    @Override
    public List<DespesasDTO> buscarDespesasPorNota(NotaFiscalDTO notaFiscalDTO) {
        return despesasMapper.toListDTO(despesasRepository.encontrarDespesasPorNota(notaFiscalDTO));
    }

    @Override
    @Transactional
    public Response inserirDespesa(DespesasDTO despesasDTO) {
        despesasRepository.persist(despesasMapper.toEntity(despesasDTO));
        return Response.ok(Json.encode("Despesa cadastrada, infelizmente.")).build();
    }

    @Override
    public List<Despesas> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO) {
        return despesasRepository.filtrarDespesas(despesasFiltroDTO);
    }
}
