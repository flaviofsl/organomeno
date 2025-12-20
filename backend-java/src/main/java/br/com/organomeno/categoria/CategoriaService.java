package br.com.organomeno.categoria;

import java.util.List;

public interface CategoriaService {

    List<CategoriaDTO> listarCategorias();

    CategoriaDTO criarCategoria(CategoriaDTO categoriaDTO);

    CategoriaDTO buscarCategoriaPorId(Long id);

    CategoriaDTO atualizarCategoria(Long id, CategoriaDTO categoriaDTO);

    void deletarCategoria(Long id);
}

