package br.com.organomeno.receitas.services;

import br.com.organomeno.receitas.entity.ReceitasDTO;
import br.com.organomeno.receitas.entity.ReceitasFiltroDTO;
import jakarta.ws.rs.core.Response;

public interface ReceitasService {
    Response filtrarReceitas(ReceitasFiltroDTO receitasFiltroDTO);
    Response inserirReceita(ReceitasDTO receitasDTO);
}
