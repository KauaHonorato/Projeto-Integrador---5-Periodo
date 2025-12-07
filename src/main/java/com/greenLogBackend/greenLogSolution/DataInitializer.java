package com.greenLogBackend.greenLogSolution;

import com.greenLogBackend.greenLogSolution.entity.Usuario;
import com.greenLogBackend.greenLogSolution.enums.PerfilUsuario;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
import com.greenLogBackend.greenLogSolution.repository.UsuarioRepository;
import com.greenLogBackend.greenLogSolution.service.CsvImportService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final CsvImportService csvImportService;
    private final BairroRepository bairroRepository;

    // Injeção de dependências para criar o usuário
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CsvImportService csvImportService,
                           BairroRepository bairroRepository,
                           UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.csvImportService = csvImportService;
        this.bairroRepository = bairroRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (bairroRepository.count() == 0) {
            System.out.println(">>> Banco de dados de Locais vazio. Iniciando carga inicial de CSVs...");

            String bairros = "dados/nome_bairros.csv";
            String ruas = "dados/ruas_conexoes.csv";
            String pontos = "dados/pontos_coleta.csv";

            csvImportService.importarDados(bairros, ruas, pontos);
        } else {
            System.out.println(">>> Dados CSV já carregados. Pulando importação.");
        }

        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setLogin("admin");
            admin.setSenha(passwordEncoder.encode("123"));
            admin.setPerfil(PerfilUsuario.ROLE_ADMIN);

            usuarioRepository.save(admin);
            System.out.println("--- USUÁRIO ADMIN CRIADO---");
            System.out.println("--- Login: admin");
            System.out.println("--- Senha: 123");
        } else {
            System.out.println("---Usuários já existem no banco.");
        }
    }
}