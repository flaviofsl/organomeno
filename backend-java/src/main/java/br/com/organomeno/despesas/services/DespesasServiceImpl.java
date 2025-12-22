package br.com.organomeno.despesas.services;

import br.com.organomeno.despesas.entity.Despesas;
import br.com.organomeno.despesas.entity.DespesasFiltroDTO;
import br.com.organomeno.despesas.repository.DespesasRepository;
import br.com.organomeno.despesas.entity.DespesasDTO;
import br.com.organomeno.despesas.entity.DespesasMapper;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
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
        Despesas despesa = despesasMapper.toEntity(despesasDTO);
        if(despesa.getFitId().equals(""))
            despesa.setFitId(null);
        despesasRepository.persist(despesa);
        despesasRepository.flush();
        DespesasDTO criada = despesasMapper.toDTO(despesa);
        return Response.status(Response.Status.CREATED).entity(criada).build();
    }

    @Override
    public List<DespesasDTO> filtrarDespesas(DespesasFiltroDTO despesasFiltroDTO) {
        return despesasMapper.toListDTO(despesasRepository.filtrarDespesas(despesasFiltroDTO));
    }

    @Override
    @Transactional
    public Response vincularNotaFiscal(DespesasDTO despesasDTO) {
        Despesas despesas = despesasMapper.toEntity(despesasDTO);
        despesas = despesasRepository.getEntityManager().merge(despesas);
        despesasRepository.persist(despesas);
        return Response.ok().build();
    }

    @Override
    @Transactional
    public DespesasDTO atualizarDespesa(Integer id, DespesasDTO despesasDTO) {
        Despesas despesa = despesasRepository.findById(id);
        if (despesa == null) {
            throw new IllegalArgumentException("Despesa não encontrada com o ID: " + id);
        }
        
        if (despesasDTO.getCategoria() != null) {
            despesa.setCategoria(despesasDTO.getCategoria());
        }
        if (despesasDTO.getDescricao() != null) {
            despesa.setDescricao(despesasDTO.getDescricao());
        }
        if (despesasDTO.getValorBruto() != null) {
            despesa.setValorBruto(despesasDTO.getValorBruto());
        }
        if (despesasDTO.getDataCadastro() != null) {
            despesa.setDataCadastro(despesasDTO.getDataCadastro());
        }
        if (despesasDTO.getFitId() != null) {
            despesa.setFitId(despesasDTO.getFitId());
        }
        if(despesa.getFitId().equals(""))
            despesa.setFitId(null);
        despesasRepository.persist(despesa);
        despesasRepository.flush();
        return despesasMapper.toDTO(despesa);
    }
}
