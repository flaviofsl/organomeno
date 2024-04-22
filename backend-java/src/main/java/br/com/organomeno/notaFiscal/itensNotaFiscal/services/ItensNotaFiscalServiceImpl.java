package br.com.organomeno.notaFiscal.itensNotaFiscal.services;

import br.com.organomeno.notaFiscal.entity.NotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalDTO;
import br.com.organomeno.notaFiscal.itensNotaFiscal.entity.ItensNotaFiscalMapper;
import br.com.organomeno.notaFiscal.itensNotaFiscal.repository.ItensNotaFiscalRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;


@ApplicationScoped
public class ItensNotaFiscalServiceImpl implements ItensNotaFiscalService{

    @Inject
    ItensNotaFiscalRepository itensNotaFiscalRepository;
    @Inject
    ItensNotaFiscalMapper itensNotaFiscalMapper;

    @Override
    public Response inserirItensNotaFiscal(NotaFiscalDTO notaFiscalDTO, ItensNotaFiscalDTO itens) throws Exception{
        try {
            itens.setNotaFiscal(notaFiscalDTO);
            itensNotaFiscalRepository.persist(itensNotaFiscalMapper.toEntity(itens));
            return Response.ok().build();
        }catch (Exception e){
            throw new Exception("Erro ao inserir itens da Nota" + e);
        }

    }
}
