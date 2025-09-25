package br.com.organomeno.pessoa;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class PessoaServiceImpl implements PessoaService {

    @Inject
    PessoaRepository pessoaRepository;

    @Inject
    DependenteRepository dependenteRepository;

    @Override
    public List<PessoaDTO> listarPessoas() {
        return pessoaRepository.listAll().stream()
                .map(PessoaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PessoaDTO criarPessoa(PessoaDTO pessoaDTO) {
        Pessoa pessoa = PessoaMapper.toEntity(pessoaDTO);
        if (pessoa.getNome() == null || pessoa.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome da pessoa é obrigatório.");
        }
        pessoaRepository.persist(pessoa);
        pessoaRepository.flush();
        return PessoaMapper.toDTO(pessoa);
    }

    @Override
    public List<DependenciaDTO> listarDependencias() {
        return dependenteRepository.listAll().stream()
                .map(PessoaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DependenciaDTO> listarDependenciasPorResponsavel(Long responsavelId) {
        return dependenteRepository.listarPorResponsavel(responsavelId).stream()
                .map(PessoaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DependenciaDTO criarDependencia(DependenciaDTO dependenciaDTO) {
        if (dependenciaDTO.getResponsavelId() == null || dependenciaDTO.getDependenteId() == null) {
            throw new IllegalArgumentException("Responsável e dependente são obrigatórios.");
        }

        if (Objects.equals(dependenciaDTO.getResponsavelId(), dependenciaDTO.getDependenteId())) {
            throw new IllegalArgumentException("Não é possível vincular uma pessoa como dependente dela mesma.");
        }

        Pessoa responsavel = pessoaRepository.findById(dependenciaDTO.getResponsavelId());
        Pessoa dependente = pessoaRepository.findById(dependenciaDTO.getDependenteId());

        if (responsavel == null || dependente == null) {
            throw new IllegalArgumentException("Responsável ou dependente não encontrados.");
        }

        Optional<Dependente> existente = dependenteRepository.buscarPorResponsavelEDependente(
                dependenciaDTO.getResponsavelId(), dependenciaDTO.getDependenteId());

        if (existente.isPresent()) {
            throw new IllegalArgumentException("Já existe um vínculo entre essas pessoas.");
        }

        Dependente dependenteEntity = new Dependente();
        dependenteEntity.setResponsavel(responsavel);
        dependenteEntity.setPessoa(dependente);
        dependenteEntity.setNivel(Optional.ofNullable(dependenciaDTO.getNivel()).orElse(1));

        dependenteRepository.persist(dependenteEntity);
        dependenteRepository.flush();

        return PessoaMapper.toDTO(dependenteEntity);
    }
}
