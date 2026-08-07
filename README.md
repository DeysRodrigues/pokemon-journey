

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


## 🔍 Visão Geral
 
O jogo funciona em duas frentes independentes:
 
1. **Front-end**: interface do jogador, animações e consumo direto da PokéAPI para gerar encontros aleatórios.
2. **Back-end**: regras de negócio (probabilidade de captura) e persistência dos Pokémon capturados em SQLite.

## 🛠️ Tecnologias
 
### 🎨 Front-end
- HTML5, CSS3, JavaScript Vanilla
- Fetch API nativa
- PokéAPI (`https://pokeapi.co`)

### ⚙️ Back-end
- Python 3
- `fastapi`, `uvicorn` (servidor web)
- `random` (cálculo de probabilidade — biblioteca nativa)
- `sqlite3` (persistência — biblioteca nativa)


## 📁 Arquitetura de Pastas
 
```
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
 
## 🔄 Fluxo de Dados
 
1. **Exploração**: o jogador clica em "Explorar". O front-end gera um ID aleatório (1–151) e busca os dados do Pokémon diretamente na PokéAPI (`GET https://pokeapi.co/api/v2/pokemon/{id}`), exibindo nome, imagem e taxa de captura.
2. **Tentativa de captura**: o jogador clica em "Jogar Pokébola". O front-end dispara a animação e envia `POST /api/capturar` ao back-end com os dados do Pokémon em tela.
3. **Cálculo e persistência**: o back-end compara um valor aleatório (`random`) com a taxa de captura recebida. Em caso de sucesso, insere o registro na tabela `inventario` (SQLite) e retorna o resultado ao front-end.
4. **Atualização do inventário**: em caso de sucesso, o front-end faz `GET /api/inventario` para sincronizar a lista exibida no PC do Oak.
> **CORS**: o back-end libera CORS (`CORSMiddleware`) para permitir que o front-end, servido em uma origem diferente (ex: Live Server), consuma a API local sem bloqueio do navegador. Em desenvolvimento, `allow_origins` está como `"*"`; antes de produção, deve ser restrito à origem real do front-end.
 
## 🌐 Endpoints da API
 
| Método | Rota               | Descrição                                              | Resposta (exemplo)                                         |
|--------|--------------------|--------------------------------------------------------|--------------------------------------------------------------|
| POST   | `/api/capturar`    | Recebe dados do Pokémon, roda o cálculo de captura e, se bem-sucedido, insere no SQLite. | `{"sucesso": true, "mensagem": "Capturado!"}` <br> `{"sucesso": false, "mensagem": "O Pokémon fugiu!"}` |
| GET    | `/api/inventario`  | Retorna todos os Pokémon salvos na tabela `inventario`. | `[{"id": 4, "nome": "Charmander", "imagem": "url.gif"}]`  |
 

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
 
   - **Windows:** `venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
3. Instale as dependências:
```bash
   pip install -r requirements.txt
```
 
4. Suba o servidor:
```bash
   uvicorn main:app --reload
```
 
   O servidor sobe por padrão em `http://127.0.0.1:8000`.
 
5. *(Opcional)* Teste as rotas sem precisar do front-end: com o servidor rodando, abra `http://127.0.0.1:8000/docs` no navegador. O FastAPI gera automaticamente uma documentação interativa onde dá pra testar o `POST /api/capturar` e o `GET /api/inventario` diretamente.


### 🎨 Front-end
 
Abra `frontend/index.html` diretamente no navegador, ou sirva a pasta com uma extensão como Live Server para evitar bloqueios de CORS ao consumir a API local.
 
## 🤝 Divisão de Responsabilidades
 
**🎨 Front-end (Deys)**

- Layout com CSS Grid e bordas arredondadas (seções "Mundo" e "Inventário").
- Consumo assíncrono da PokéAPI (ID aleatório 1–151).
- Animações (Pokébola, sucesso, fuga).
- Integração com o back-end (POST na captura, GET no inventário).

**⚙️ Back-end (Carol)**

- Algoritmo de captura (`random` vs. taxa de captura recebida).
- Persistência em SQLite (tabela `inventario`, funções de INSERT/SELECT).
- Criação dos endpoints FastAPI.
- Tratamento de erros de banco (try/except/finally em `database.py`, com log e `raise` — falhas de persistência não são expostas como resposta da API).


## 🔀 Estratégia de Versionamento
 
Fluxo baseado em *feature branches* e Pull Requests, para fins didáticos e organização do repositório.