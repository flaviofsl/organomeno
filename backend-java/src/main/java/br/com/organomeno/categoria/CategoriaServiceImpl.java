package br.com.organomeno.categoria;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class CategoriaServiceImpl implements CategoriaService {

    @Inject
    CategoriaRepository categoriaRepository;

    @Override
    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.listAll().stream()
                .map(CategoriaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoriaDTO criarCategoria(CategoriaDTO categoriaDTO) {
        Categoria categoria = CategoriaMapper.toEntity(categoriaDTO);
        if (categoria.getNome() == null || categoria.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }
        categoriaRepository.persist(categoria);
        categoriaRepository.flush();
        return CategoriaMapper.toDTO(categoria);
    }

    @Override
    public CategoriaDTO buscarCategoriaPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new IllegalArgumentException("Categoria não encontrada com o ID: " + id);
        }
        return CategoriaMapper.toDTO(categoria);
    }

    @Override
    @Transactional
    public CategoriaDTO atualizarCategoria(Long id, CategoriaDTO categoriaDTO) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new IllegalArgumentException("Categoria não encontrada com o ID: " + id);
        }
        
        if (categoriaDTO.getNome() == null || categoriaDTO.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }
        
        categoria.setNome(categoriaDTO.getNome());
        categoria.setDescricao(categoriaDTO.getDescricao());
        categoria.setAtiva(categoriaDTO.getAtiva() != null ? categoriaDTO.getAtiva() : true);
        
        categoriaRepository.persist(categoria);
        categoriaRepository.flush();
        return CategoriaMapper.toDTO(categoria);
    }

    @Override
    @Transactional
    public void deletarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id);
        if (categoria == null) {
            throw new IllegalArgumentException("Categoria não encontrada com o ID: " + id);
        }
        categoriaRepository.delete(categoria);
    }
}

