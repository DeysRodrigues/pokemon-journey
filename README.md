# 🔴 Jornada Pokémon ⚪

Web game interativo com foco educacional. O front-end consome diretamente a [PokéAPI](https://pokeapi.co) pública para gerar encontros com Pokémon selvagens. O back-end em Python atua como servidor de regras e persistência, calculando a probabilidade de captura com base na dificuldade do Pokémon e salvando o progresso do jogador em um banco de dados local.

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Arquitetura de Pastas](#-arquitetura-de-pastas)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Endpoints da API](#-endpoints-da-api)
- [Como Executar](#-como-executar)
- [Divisão de Responsabilidades](#-divisão-de-responsabilidades)
- [Estratégia de Versionamento](#-estratégia-de-versionamento)

---

## 🔍 Visão Geral

O jogo funciona em duas frentes independentes:

1. **Front-end:** interface do jogador, animações e consumo direto da PokéAPI para gerar encontros aleatórios.
2. **Back-end:** regras de negócio (probabilidade de captura) e persistência da coleção de Pokémon capturados em SQLite.

---

## 🛠️ Tecnologias

### 🎨 Front-end

- HTML5
- CSS3
- JavaScript Vanilla
- Fetch API nativa
- PokéAPI (`https://pokeapi.co`)

### ⚙️ Back-end

- Python 3
- `fastapi`
- `uvicorn` (servidor web)
- `random` (cálculo de probabilidade — biblioteca nativa)
- `sqlite3` (persistência — biblioteca nativa)

---

## 📁 Arquitetura de Pastas

```text
jornada-pokemon/
│
├── backend/
│   ├── main.py                  # Servidor (FastAPI) com as rotas.
│   ├── game_logic.py            # Função isolada de probabilidade de captura.
│   ├── database.py              # Queries do SQLite.
│   ├── requirements.txt         # Dependências do back-end.
│   └── inventario.db            # Banco de dados (gerado em tempo de execução).
│
├── frontend/
│   ├── index.html               # Estrutura base da interface.
│   ├── css/
│   │   └── style.css            # Estilos e animações.
│   ├── js/
│   │   └── script.js            # Integração e manipulação da DOM.
│   └── assets/                  # Imagens, ícones e fontes.
│
└── README.md
```

---

## 🔄 Fluxo de Dados

1. **Exploração:** o jogador clica em **"Explorar"**. O front-end gera um ID aleatório (1–151) e busca os dados do Pokémon diretamente na PokéAPI (`GET https://pokeapi.co/api/v2/pokemon/{id}`), exibindo nome, imagem e taxa de captura.

2. **Tentativa de captura:** o jogador clica em **"Jogar Pokébola"**. O front-end dispara a animação e envia um `POST /api/capturar` ao back-end com os dados do Pokémon exibido na tela.

3. **Cálculo e persistência:** o back-end compara um valor aleatório (`random`) com a taxa de captura recebida. Em caso de sucesso, verifica se o Pokémon já está registrado na coleção. Caso ainda não exista, ele é inserido na tabela `inventario` (SQLite). Se já estiver registrado, o sistema apenas informa que o Pokémon já faz parte da coleção, evitando registros duplicados.

4. **Atualização do inventário:** após uma captura bem-sucedida, o front-end realiza um `GET /api/inventario` para sincronizar a coleção exibida no PC do Professor Oak.

5. **Tratamento de erros:** durante a execução das rotas da API, possíveis falhas são capturadas pelo back-end. Erros relacionados às operações internas são tratados para evitar que a aplicação seja interrompida, retornando respostas HTTP adequadas ao cliente quando necessário.

> **CORS:** o back-end utiliza `CORSMiddleware` para permitir que o front-end, servido em uma origem diferente (como o Live Server), consuma a API local sem bloqueios do navegador. Em desenvolvimento, `allow_origins` está configurado como `"*"`. Em produção, recomenda-se restringir às origens autorizadas.

---

## 🌐 Endpoints da API

| Método | Rota | Descrição | Resposta (exemplo) |
|--------|------|-----------|--------------------|
| **POST** | `/api/capturar` | Recebe os dados do Pokémon, executa o cálculo de captura e, em caso de sucesso, adiciona o Pokémon à coleção **caso ele ainda não faça parte do inventário**. Se o Pokémon já estiver registrado, ele não é duplicado no banco de dados. | `{"sucesso": true, "mensagem": "Pokémon capturado!"}`<br>`{"sucesso": true, "mensagem": "Este Pokémon já faz parte da sua coleção!"}`<br>`{"sucesso": false, "mensagem": "O Pokémon fugiu!"}` |
| **GET** | `/api/inventario` | Retorna todos os Pokémon registrados na coleção do jogador. | `[{"id":4,"nome":"Charmander","imagem":"url.gif"}]` |

---

## ▶️ Como Executar

### ⚙️ Back-end

1. Entre na pasta do back-end:

```bash
cd backend
```

2. *(Opcional, mas recomendado)* Crie e ative um ambiente virtual:

```bash
python -m venv venv
```

- **Windows**

```bash
venv\Scripts\activate
```

- **Mac/Linux**

```bash
source venv/bin/activate
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Execute o servidor:

```bash
uvicorn main:app --reload
```

O servidor estará disponível em:

```
http://127.0.0.1:8000
```

5. *(Opcional)* Acesse a documentação automática do FastAPI:

```
http://127.0.0.1:8000/docs
```

Nela é possível testar diretamente os endpoints da API.

---

### 🎨 Front-end

Abra o arquivo `frontend/index.html` diretamente no navegador ou utilize uma extensão como **Live Server** para evitar bloqueios relacionados ao CORS durante o consumo da API local.

---

## 🤝 Divisão de Responsabilidades

### 🎨 Front-end (Deys)

- Layout utilizando CSS Grid e bordas arredondadas.
- Consumo assíncrono da PokéAPI (IDs de 1 a 151).
- Animações da Pokébola, captura e fuga.
- Integração com o back-end (`POST` na captura e `GET` no inventário).


### ⚙️ Back-end (Carol)

* Algoritmo de captura (`random` × taxa de captura).
* Persistência da coleção em SQLite (`inventario`).
* Prevenção de registros duplicados na coleção.
* Criação dos endpoints FastAPI.
* Tratamento de erros de banco utilizando `try`, `except` e `finally`.
* Tratamento de exceções HTTP utilizando `HTTPException`, retornando respostas adequadas para situações de erro durante o processamento das requisições.

O back-end mantém as regras de negócio centralizadas, garantindo que validações, cálculos de captura e operações no banco de dados sejam executados de forma controlada antes de retornar uma resposta ao front-end.


---

## 🔀 Estratégia de Versionamento 

Fluxo baseado em **Feature Branches** e **Pull Requests**, permitindo o desenvolvimento paralelo das funcionalidades e facilitando a revisão e integração do código ao repositório principal.