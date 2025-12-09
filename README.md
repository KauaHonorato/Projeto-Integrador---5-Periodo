
## GreenLog Solutions


## Integrantes do grupo
Kaua Honorato

Pedro Assumpção

Rayssa Alves

Wagner Gomes


### Visão Geral

Este projeto é composto por dois módulos principais:

1.  **Backend (`greenLogSolution-backend`):** Uma API RESTful desenvolvida em Java com Spring Boot, responsável por toda a lógica de negócio, persistência de dados (PostgreSQL) e o motor de cálculo de rotas.
2.  **Frontend (`greenlog-web`):** Uma Single Page Application (SPA) desenvolvida em Angular, que fornece a interface de utilizador para gerir entidades e calcular rotas otimizadas.

---

### Tecnologias Utilizadas

| Módulo | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Backend** | **Java 21** & **Spring Boot 3.3.0** | Linguagem e framework principal. |
| | **Spring Data JPA & Hibernate** | Persistência de dados com PostgreSQL. |
| | **PostgreSQL** | Banco de dados relacional. |
| | **Spring Security** | Autenticação e autorização (baseada em `UsernamePasswordAuthenticationToken` / `Basic Auth`). |
| | **JGraphT** | Biblioteca de grafos utilizada na otimização de rotas (`DijkstraShortestPath` em `RotaService`). |
| **Frontend** | **Angular** | Framework principal para a interface do utilizador. |
| | **PrimeNG** | Biblioteca de componentes UI para a interface (Tabelas, Formulários, Toast, etc.). |
| | **TypeScript** | Linguagem de desenvolvimento do frontend. |

---

### Configuração e Instalação

#### Pré-requisitos

Certifique-se de ter instalado:

* Java Development Kit (JDK) 21
* Apache Maven
* Node.js e npm (recomendado v20+)
* Angular CLI (`npm install -g @angular/cli`)
* Servidor PostgreSQL

#### 1. Configuração do Banco de Dados (Backend)

O backend está configurado para ligar-se a uma base de dados PostgreSQL.

* **Database URL:** `jdbc:postgresql://localhost:5432/greenlog_db`
* **Username:** `postgres`
* **Password:** `admin`

Crie uma base de dados com o nome `greenlog_db` antes de iniciar o backend. O Spring Boot irá criar o esquema automaticamente (`spring.jpa.hibernate.ddl-auto=update`). O `DataInitializer` irá carregar dados iniciais de bairros, ruas e pontos de coleta a partir de arquivos CSV na primeira execução.

#### 2. Execução do Backend

1.  Navegue até a pasta do backend:
    ```bash
    cd greenLogSolution-backend
    ```

2.  Compile e inicie a aplicação Spring Boot:
    ```bash
    ./mvnw spring-boot:run
    # ou, no Windows:
    # mvnw spring-boot:run
    ```
    A API estará acessível em `http://localhost:8080/api`.

#### 3. Execução do Frontend

1.  Navegue até a pasta do frontend:
    ```bash
    cd ../greenlog-web
    ```

2.  Instale as dependências:
    ```bash
    npm install primeng@17.18.0 primeicons primeflex --legacy-peer-deps
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    ng serve
    ```
    A aplicação estará acessível em `http://localhost:4200/`.

---

### Funcionalidades Principais

| Módulo | Descrição | Endpoint de Exemplo (Backend) |
| :--- | :--- | :--- |
| **Cálculo de Rotas** | Otimiza a rota de coleta entre dois pontos (Origem e Destino), considerando o tipo de resíduo e a capacidade do veículo, utilizando Dijkstra para encontrar o caminho mais curto entre bairros. | `POST /api/rotas/calcular` |
| **Gestão de Itinerários** | Permite agendar uma rota calculada para uma data específica, com validação para evitar conflito de agenda do caminhão (`existsByCaminhaoIdAndData`). | `POST /api/itinerarios/agendar` |
| **Gestão de Caminhões** | CRUD completo de veículos, incluindo validação de placa (padrão Mercosul/Antigo). | `POST /api/caminhoes` |
| **Gestão de Pontos de Coleta** | CRUD de pontos de coleta, atrelados a um `Bairro` e com um conjunto de `TipoResiduo` aceites. | `POST /api/pontos-coleta` |
| **Segurança** | Autenticação por Login/Senha via `/api/auth/login`. Rotas protegidas por `authGuard` no frontend. | `POST /api/auth/login` |

### Credenciais de Acesso (Teste)

Para acesso inicial na aplicação, utilize as seguintes credenciais:

| Campo | Valor Sugerido |
| :--- | :--- |
| **Usuário (Login)** | `admin` |
| **Senha (Password)** | `123` |
