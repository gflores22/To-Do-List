# To-Do List - Aplicação Full-Stack (Spring Boot + Bootstrap)

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white) ![H2](https://img.shields.io/badge/H2_Database-InMemory-red?style=for-the-badge)

Uma aplicação web simples, porém completa, de lista de tarefas (To-Do List) construída com Java/Spring Boot para o backend REST API e HTML/Bootstrap/JavaScript puro para o frontend interativo e responsivo.

## ✨ Funcionalidades

* **Criar Tarefas:** Adicione novas tarefas à lista.
* **Visualizar Tarefas:** Veja todas as tarefas pendentes.
* **Marcar como Concluída:** Alterne o status de uma tarefa entre pendente e concluída.
* **Editar Tarefas:** Modifique a descrição de tarefas existentes.
* **Excluir Tarefas:** Remova tarefas da lista.
* **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela graças ao Bootstrap.

## 🛠️ Tecnologias Utilizadas

**Backend (`todo-backend`):**

* **Java 17+**
* **Spring Boot 3.x**
    * Spring Web (REST API)
    * Spring Data JPA (Persistência)
* **Maven** (Gerenciador de dependências e build) *ou Gradle*
* **H2 Database** (Banco de dados em memória para desenvolvimento)
* **Lombok** (Redução de código boilerplate)

**Frontend (`todo-frontend`):**

* **HTML5**
* **CSS3** (via Bootstrap e estilos inline básicos)
* **JavaScript (ES6+)** (Manipulação do DOM e requisições API com `Workspace`)
* **Bootstrap 5.3** (Framework CSS para layout e componentes)
* **VS Code Live Server** (Servidor de desenvolvimento local)

## 📂 Estrutura do Projeto

O repositório está dividido em duas pastas principais:

```
├── todo-backend/      # Código do Backend (Spring Boot)
│   ├── src/
│   └── pom.xml        # Ou build.gradle
├── todo-frontend/     # Código do Frontend (HTML, JS, CSS)
│   ├── index.html
│   └── script.js
└── README.md          # Este arquivo
```

## 🚀 Como Executar o Projeto

Siga os passos abaixo para configurar e rodar a aplicação localmente.

### Pré-requisitos

* **JDK 17 ou superior:** [OpenJDK](https://jdk.java.net/) / [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
* **Maven 3.6+** ou **Gradle 7+** (dependendo do que foi usado no projeto Spring Boot): [Maven](https://maven.apache.org/download.cgi) / [Gradle](https://gradle.org/install/)
* **Git:** [Git SCM](https://git-scm.com/downloads)
* **IDE Java (Recomendado):** [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) ou [Eclipse](https://www.eclipse.org/downloads/)
* **Editor de Código (Recomendado):** [Visual Studio Code](https://code.visualstudio.com/download/)
    * Extensão **Live Server** instalada no VS Code.

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/gflores22/To-Do-List.git](https://github.com/gflores22/To-Do-List.git)
    cd To-Do-List
    ```

2.  **Execute o Backend (`todo-backend`):**
    * **Opção 1: Usando uma IDE (IntelliJ IDEA recomendado):**
        * Abra a pasta `todo-backend` como um projeto na sua IDE.
        * Aguarde a IDE baixar as dependências do Maven/Gradle.
        * Encontre a classe `TodoBackendApplication.java` (geralmente em `src/main/java/com/example/todobackend/`).
        * Execute o método `main` desta classe.
    * **Opção 2: Via Linha de Comando (Maven):**
        ```bash
        cd todo-backend
        mvn spring-boot:run
        ```
    * **Opção 2: Via Linha de Comando (Gradle):**
        ```bash
        cd todo-backend
        ./gradlew bootRun
        ```
    * O backend estará rodando em `http://localhost:8080`.

3.  **Execute o Frontend (`todo-frontend`):**
    * Abra a pasta `todo-frontend` no Visual Studio Code.
    * Clique com o botão direito no arquivo `index.html`.
    * Selecione a opção "Open with Live Server".
    * Seu navegador padrão abrirá automaticamente a aplicação frontend (geralmente em um endereço como `http://127.0.0.1:5500` ou `http://localhost:5500`).

4.  **Acesse a Aplicação:**
    * Use o endereço fornecido pelo Live Server no seu navegador.
    * Você deverá ver a interface da lista de tarefas e poderá interagir com ela.

### (Opcional) Acessando o Console H2

Se o backend estiver rodando, você pode acessar o console do banco de dados H2 em memória:

* URL: `http://localhost:8080/h2-console`
* JDBC URL: `jdbc:h2:mem:tododb`
* Username: `sa`
* Password: (deixe em branco)

## ⚙️ Configuração

* **Porta do Backend:** Definida em `todo-backend/src/main/resources/application.properties` (padrão: `8080`).
* **Configuração do Banco H2:** Também em `application.properties`. Atualmente configurado para rodar em memória.
* **CORS:** A permissão para o frontend (`http://127.0.0.1:5500`) acessar o backend (`http://localhost:8080`) é configurada pela anotação `@CrossOrigin(origins = "*")` na classe `TaskController.java`. Para produção, este valor deve ser restrito ao domínio real do seu frontend.

## 📝 Endpoints da API

O backend expõe os seguintes endpoints REST:

* `GET /api/tasks`: Retorna todas as tarefas.
* `POST /api/tasks`: Cria uma nova tarefa.
    * *Corpo:* `{ "description": "Descrição da tarefa", "completed": false }`
* `PUT /api/tasks/{id}`: Atualiza uma tarefa existente (usado para editar descrição e marcar como concluída).
    * *Corpo:* `{ "description": "Nova descrição", "completed": true/false }`
* `DELETE /api/tasks/{id}`: Exclui uma tarefa específica.

## 🔮 Melhorias Futuras (TODO)

* [ ] Persistir dados em um banco relacional (PostgreSQL, MySQL) em vez de H2 em memória.
* [ ] Adicionar autenticação/autorização de usuários (Spring Security, JWT).
* [ ] Melhorar a interface do usuário (UI/UX) com CSS customizado ou mais componentes Bootstrap.
* [ ] Implementar testes unitários e de integração para o backend.
* [ ] Adicionar paginação para listas de tarefas muito longas.
* [ ] Implementar feedback visual mais claro para o usuário (e.g., "loading spinners", mensagens de sucesso/erro).

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

* **[Gabriel Flores Chinelli / gflores22]** - [Perfil GitHub](https://github.com/gflores22)

---

Sinta-se à vontade para contribuir, reportar issues ou sugerir melhorias!