package br.com.organomeno.ofx.services;

import br.com.organomeno.ofx.entity.ArquivoOfxDTO;
import br.com.organomeno.ofx.entity.DetalhesArquivoOfxDTO;

import java.util.List;

public interface ArquivoOfxService {
    List<ArquivoOfxDTO> listarArquivosImportados();
    DetalhesArquivoOfxDTO buscarDetalhesArquivo(Long idArquivo);
}

