package br.com.organomeno.pessoa;

public class DependenciaDTO {

    private Long id;
    private Long responsavelId;
    private String responsavelNome;
    private Long dependenteId;
    private String dependenteNome;
    private Integer nivel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getResponsavelId() {
        return responsavelId;
    }

    public void setResponsavelId(Long responsavelId) {
        this.responsavelId = responsavelId;
    }

    public String getResponsavelNome() {
        return responsavelNome;
    }

    public void setResponsavelNome(String responsavelNome) {
        this.responsavelNome = responsavelNome;
    }

    public Long getDependenteId() {
        return dependenteId;
    }

    public void setDependenteId(Long dependenteId) {
        this.dependenteId = dependenteId;
    }

    public String getDependenteNome() {
        return dependenteNome;
    }

    public void setDependenteNome(String dependenteNome) {
        this.dependenteNome = dependenteNome;
    }

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }
}
