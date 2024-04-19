package br.com.organomeno.contasCategorias.services;

import br.com.organomeno.contasCategorias.entity.ContasCategorias;
import br.com.organomeno.contasCategorias.entity.ContasCategoriasDTO;
import jakarta.ws.rs.core.Response;

import java.util.List;

public interface ContasCategoriasService {
    List<ContasCategorias> buscarTodasCategorias();
    ContasCategorias buscarCategoriaPorId(Integer id);
    Response excluirCategoriaPorID(Integer id);
    Response inserirCategoria(ContasCategoriasDTO contasCategoriasDTO);
}
