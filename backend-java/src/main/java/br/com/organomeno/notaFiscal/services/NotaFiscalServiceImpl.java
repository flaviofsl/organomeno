package br.com.organomeno.notaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalFiltroDTO;
import br.com.organomeno.notaFiscal.entity.NotaFiscalMapper;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalDTO;
import br.com.organomeno.notaFiscal.repository.NotaFiscalRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
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
    public Response inserirNotaFiscal(NotaFiscalDTO notaFiscalDTO) throws Exception{
        try {
            notaFiscalRepository.persist(notaFiscalMapper.toEntity(notaFiscalDTO));
            return Response.ok().build();
        }catch (Exception e){
            throw new Exception("Erro ao inserir Nota Fiscal" + e);
        }

    }
}
