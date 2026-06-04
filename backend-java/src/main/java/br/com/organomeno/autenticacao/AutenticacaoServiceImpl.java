package br.com.organomeno.autenticacao;

import br.com.organomeno.grupofamiliar.GrupoFamiliar;
import br.com.organomeno.grupofamiliar.GrupoFamiliarRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@ApplicationScoped
public class AutenticacaoServiceImpl implements AutenticacaoService {

    @Inject
    UsuarioRepository usuarioRepository;

    @Inject
    GrupoFamiliarRepository grupoFamiliarRepository;

    @Inject
    TokenRepository tokenRepository;

    @Override
    @Transactional
    public UsuarioDTO cadastrar(CadastroUsuarioDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório.");
        }
        if (dto.getSenha() == null || dto.getSenha().length() < 6) {
            throw new IllegalArgumentException("Senha deve ter no mínimo 6 caracteres.");
        }
        if (!dto.getSenha().equals(dto.getConfirmacaoSenha())) {
            throw new IllegalArgumentException("Senha e confirmação não conferem.");
        }
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado.");
        }

        GrupoFamiliar grupo;
        String papel;

        if (dto.getNomeGrupoFamiliar() != null && !dto.getNomeGrupoFamiliar().isBlank()) {
            // Cria novo grupo familiar e o usuário é o ADMIN
            grupo = new GrupoFamiliar();
            grupo.setNome(dto.getNomeGrupoFamiliar());
            grupoFamiliarRepository.persist(grupo);
            grupoFamiliarRepository.flush();
            papel = "ADMIN";
        } else {
            throw new IllegalArgumentException("Informe o nome do grupo familiar ou um código de convite.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail().toLowerCase().trim());
        usuario.setSenhaHash(hashSenha(dto.getSenha()));
        usuario.setGrupoFamiliar(grupo);
        usuario.setPapel(papel);
        usuario.setStatus("ATIVO");
        usuario.setAtivo(true);

        usuarioRepository.persist(usuario);
        usuarioRepository.flush();

        return toDTO(usuario);
    }

    @Override
    @Transactional
    public TokenAcessoDTO login(LoginDTO dto) {
        if (dto.getEmail() == null || dto.getSenha() == null) {
            throw new IllegalArgumentException("Email e senha são obrigatórios.");
        }

        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Credenciais inválidas."));

        if (!usuario.getSenhaHash().equals(hashSenha(dto.getSenha()))) {
            throw new IllegalArgumentException("Credenciais inválidas.");
        }

        usuario.setUltimoAcesso(LocalDateTime.now());
        usuarioRepository.persist(usuario);

        // Token simples Base64 — substituir por JWT quando quarkus-smallrye-jwt for adicionado
        String token = Base64.getEncoder().encodeToString(
                (usuario.getId() + ":" + usuario.getGrupoFamiliar().getId() + ":" + UUID.randomUUID())
                        .getBytes(StandardCharsets.UTF_8));

        return new TokenAcessoDTO(token, toDTO(usuario));
    }

    @Override
    @Transactional
    public void solicitarRecuperacaoSenha(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email é obrigatório.");
        }
        // Não revelar se email existe ou não (segurança)
        usuarioRepository.findByEmail(email.toLowerCase().trim()).ifPresent(usuario -> {
            TokenRecuperacaoSenha token = new TokenRecuperacaoSenha();
            token.setUsuario(usuario);
            token.setToken(UUID.randomUUID().toString());
            token.setDataExpiracao(LocalDateTime.now().plusHours(2));
            token.setUsado(false);
            tokenRepository.persist(token);
            // TODO: enviar email com link de recuperação
        });
    }

    @Override
    @Transactional
    public void redefinirSenha(String tokenStr, String novaSenha) {
        if (novaSenha == null || novaSenha.length() < 6) {
            throw new IllegalArgumentException("Nova senha deve ter no mínimo 6 caracteres.");
        }

        TokenRecuperacaoSenha token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou expirado."));

        if (!token.isValido()) {
            throw new IllegalArgumentException("Token inválido ou expirado.");
        }

        token.getUsuario().setSenhaHash(hashSenha(novaSenha));
        token.setUsado(true);
        usuarioRepository.persist(token.getUsuario());
        tokenRepository.persist(token);
    }

    private UsuarioDTO toDTO(Usuario u) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(u.getId());
        dto.setNome(u.getNome());
        dto.setEmail(u.getEmail());
        dto.setPapel(u.getPapel());
        dto.setStatus(u.getStatus());
        dto.setAtivo(u.getAtivo());
        dto.setDataCriacao(u.getDataCriacao());
        dto.setUltimoAcesso(u.getUltimoAcesso());
        if (u.getGrupoFamiliar() != null) {
            dto.setIdGrupoFamiliar(u.getGrupoFamiliar().getId());
            dto.setNomeGrupoFamiliar(u.getGrupoFamiliar().getNome());
        }
        return dto;
    }

    private String hashSenha(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Erro ao processar senha.", e);
        }
    }
}
