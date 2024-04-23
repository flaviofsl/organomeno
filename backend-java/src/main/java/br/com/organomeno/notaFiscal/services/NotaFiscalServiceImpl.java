package br.com.organomeno.notaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscal;
import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalMapper;
import br.com.organomeno.notaFiscal.repository.NotaFiscalRepository;
import br.com.organomeno.scrapNotaFiscal.IdentificadorLayout;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response;


@ApplicationScoped
public class NotaFiscalServiceImpl implements NotaFiscalService{

    @Inject
    NotaFiscalRepository notaFiscalRepository;
    @Inject
    NotaFiscalMapper notaFiscalMapper;


    @Override
    public Response filtrarNotaFiscal(NotaFiscalFiltroDTO notaFiscalFiltroDTO) {
        return null;
    }

    @Override
    @Transactional
    public Response inserirNotaFiscal(IdentificadorLayout identificadorLayout) throws Exception{
        try {
            notaFiscalRepository.persist(notaFiscalMapper.toEntity(identificadorLayout.getLayout()));
            return Response.ok("Cadastrado com sucesso").build();
        }catch (Exception e){
            throw new Exception("Erro ao inserir Nota Fiscal" + e);
        }
    }
}
