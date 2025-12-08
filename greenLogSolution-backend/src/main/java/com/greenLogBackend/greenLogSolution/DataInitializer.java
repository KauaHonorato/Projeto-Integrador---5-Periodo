package com.greenLogBackend.greenLogSolution;

import com.greenLogBackend.greenLogSolution.dto.UsuarioRequest;
import com.greenLogBackend.greenLogSolution.enums.PerfilUsuario;
import com.greenLogBackend.greenLogSolution.repository.BairroRepository;
import com.greenLogBackend.greenLogSolution.repository.UsuarioRepository; // NOVO
import com.greenLogBackend.greenLogSolution.service.CsvImportService;
import com.greenLogBackend.greenLogSolution.service.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final CsvImportService csvImportService;
    private final BairroRepository bairroRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository; // NOVO

    // Construtor atualizado com a nova dependência
    public DataInitializer(CsvImportService csvImportService,
                           BairroRepository bairroRepository,
                           UsuarioService usuarioService,
                           UsuarioRepository usuarioRepository) {
        this.csvImportService = csvImportService;
        this.bairroRepository = bairroRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Lógica de Criação do Usuário (Totalmente independente da importação de CSV)
        criarUsuarioAdminInicial();

        // 2. Lógica de Importação de Dados CSV (Executa se o banco estiver vazio de Bairros)
        if (bairroRepository.count() == 0) {
            System.out.println(">>> Banco de dados vazio. Iniciando carga inicial de CSVs...");

            String bairros = "dados/nome_bairros.csv";
            String ruas = "dados/ruas_conexoes.csv";
            String pontos = "dados/pontos_coleta.csv";

            csvImportService.importarDados(bairros, ruas, pontos);
        } else {
            System.out.println(">>> Dados já carregados. Pulando importação CSV.");
        }
    }

    private void criarUsuarioAdminInicial() {
        // Verifica a existência pelo login (que é um campo unique)
        if (usuarioRepository.findByLogin("admin").isEmpty()) {
            System.out.println(">>> Usuário 'admin' não encontrado. Criando usuário inicial...");
            try {
                UsuarioRequest adminRequest = new UsuarioRequest("admin", "123", PerfilUsuario.ROLE_ADMIN);
                // O service criptografa e salva o usuário em uma transação @Transactional separada.
                usuarioService.cadastrarUsuario(adminRequest);
                System.out.println(">>> Usuário admin/123 (ROLE_ADMIN) criado com sucesso.");
            } catch (Exception e) {
                // Se houver algum erro de persistência, ele será logado no console.
                System.err.println("ERRO FATAL: Falha ao criar usuário inicial. Verifique o log. Erro: " + e.getMessage());
            }
        } else {
            System.out.println(">>> Usuário 'admin' já existe. Nenhuma ação necessária.");
        }
    }
}
