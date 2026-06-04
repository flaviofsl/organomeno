package br.com.organomeno.categoria;

public final class CategoriaMapper {

    private CategoriaMapper() {
    }

    public static Categoria toEntity(CategoriaDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setId(dto.getId());
        categoria.setNome(dto.getNome());
        categoria.setDescricao(dto.getDescricao());
        categoria.setTipo(dto.getTipo());
        categoria.setIcone(dto.getIcone());
        categoria.setCor(dto.getCor());
        categoria.setAtiva(dto.getAtiva() != null ? dto.getAtiva() : true);
        // grupoFamiliar é resolvido no Service, não aqui
        return categoria;
    }

    public static CategoriaDTO toDTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setId(categoria.getId());
        dto.setNome(categoria.getNome());
        dto.setDescricao(categoria.getDescricao());
        dto.setTipo(categoria.getTipo());
        dto.setIcone(categoria.getIcone());
        dto.setCor(categoria.getCor());
        dto.setAtiva(categoria.getAtiva());
        if (categoria.getGrupoFamiliar() != null) {
            dto.setIdGrupoFamiliar(categoria.getGrupoFamiliar().getId().longValue());
        }
        return dto;
    }
}
