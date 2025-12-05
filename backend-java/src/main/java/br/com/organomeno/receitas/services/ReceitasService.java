package br.com.organomeno.receitas.services;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface ReceitasService {

    List<ReceitasDTO> buscarTodasAsReceitas();

    ReceitasDTO buscarReceitaPorId(Integer id);

    Response filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO);

    Response inserirReceita(ReceitasDTO receitasDTO);

    Response inserirNotaFiscal(ReceitasDTO receitasDTO);

    ReceitasDTO atualizarReceita(Integer id, ReceitasDTO receitasDTO);
}
