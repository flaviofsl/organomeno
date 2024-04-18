package br.com.organomemo.contasCategorias;

import jakarta.ws.rs.core.Response;

import java.util.List;

public interface ContasCategoriasService {
    List<ContasCategorias> buscarTodasCategorias();
    ContasCategorias buscarCategoriaPorId(Integer id);
    Response excluirCategoriaPorID(Integer id);
    Response inserirCategoria(ContasCategorias contasCategoriasDTO);
}
