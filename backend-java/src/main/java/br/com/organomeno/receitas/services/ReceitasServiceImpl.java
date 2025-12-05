package br.com.organomeno.receitas.services;

import br.com.organomeno.receitas.entity.Receitas;
import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import br.com.organomeno.receitas.entity.ReceitasMapper;
import br.com.organomeno.receitas.repository.ReceitasRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;

import java.util.List;

@ApplicationScoped
public class ReceitasServiceImpl implements ReceitasService{

    @Inject
    ReceitasRepository receitasRepository;
    @Inject
    ReceitasMapper receitasMapper;

    @Override
    public Response filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO) {
        List<ReceitasDTO> receitas = receitasMapper.toDTOList(receitasRepository.filtrarReceitas(receitasFiltroDTO));
        return Response.ok(receitas).build();
    }

    @Override
    public List<ReceitasDTO> buscarTodasAsReceitas() {
        return receitasMapper.toDTOList(receitasRepository.findAll().stream().toList());
    }

    @Override
    public ReceitasDTO buscarReceitaPorId(Integer id) {
        Receitas receita = receitasRepository.findById(id);
        if (receita == null) {
            throw new IllegalArgumentException("Receita não encontrada com o ID: " + id);
        }
        return receitasMapper.toDTO(receita);
    }

    @Override
    @Transactional
    public Response inserirReceita(ReceitasDTO receitasDTO) {
        Receitas receita = receitasMapper.toEntity(receitasDTO);
        receitasRepository.persist(receita);
        receitasRepository.flush();
        ReceitasDTO criada = receitasMapper.toDTO(receita);
        return Response.status(Response.Status.CREATED).entity(criada).build();
    }

    @Override
    public Response inserirNotaFiscal(ReceitasDTO receitasDTO) {
        receitasRepository.persist(receitasMapper.toEntity(receitasDTO));
        return Response.ok().build();
    }

    @Override
    @Transactional
    public ReceitasDTO atualizarReceita(Integer id, ReceitasDTO receitasDTO) {
        Receitas receita = receitasRepository.findById(id);
        if (receita == null) {
            throw new IllegalArgumentException("Receita não encontrada com o ID: " + id);
        }
        
        if (receitasDTO.getDescricao() != null) {
            receita.setDescricao(receitasDTO.getDescricao());
        }
        if (receitasDTO.getValorBruto() != null) {
            receita.setValorBruto(receitasDTO.getValorBruto());
        }
        if (receitasDTO.getDataEntrada() != null) {
            receita.setDataEntrada(receitasDTO.getDataEntrada());
        }
        if (receitasDTO.getFitId() != null) {
            receita.setFitId(receitasDTO.getFitId());
        }
        
        receitasRepository.persist(receita);
        receitasRepository.flush();
        return receitasMapper.toDTO(receita);
    }
}
