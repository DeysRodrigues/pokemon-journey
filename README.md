# Jornada Pokémon

![Python](https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?logo=sqlite&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Web game interativo com foco educacional. O front-end consome diretamente a [PokéAPI](https://pokeapi.co) pública para gerar encontros com Pokémon selvagens. O back-end em Python atua como servidor de regras e persistência, calculando a probabilidade de captura com base na dificuldade do Pokémon e salvando o progresso do jogador em um banco de dados local.

## Preview

<p align="center">
  <img src="screenshots/mapa.png" width="48%" alt="Tela de exploração (mapa)" />
  <img src="screenshots/bag.png" width="48%" alt="Tela da Bag (inventário)" />
</p>

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura de Pastas](#arquitetura-de-pastas)
- [Fluxo de Dados](#fluxo-de-dados)
- [Endpoints da API](#endpoints-da-api)
- [Como Executar](#como-executar)
- [Qualidade de Código](#qualidade-de-código)
- [Divisão de Responsabilidades](#divisão-de-responsabilidades)
- [Estratégia de Versionamento](#estratégia-de-versionamento)
- [Licença](#licença)

Documentação completa de funcionalidades e fluxogramas: [DOCUMENTACAO.md](./DOCUMENTACAO.md)

## Visão Geral

O jogo funciona em duas frentes independentes:

1. **Front-end:** interface do jogador, animações e consumo direto da PokéAPI para gerar encontros aleatórios.
2. **Back-end:** regras de negócio (probabilidade de captura) e persistência da coleção de Pokémon capturados em SQLite.

## Tecnologias

**Front-end**

- HTML5
- CSS3
- JavaScript Vanilla (módulos ES)
- Fetch API nativa
- PokéAPI (`https://pokeapi.co`)

**Back-end**

- Python 3
- `fastapi`
- `uvicorn` (servidor web)
- `random` (cálculo de probabilidade, biblioteca nativa)
- `sqlite3` (persistência, biblioteca nativa)

## Arquitetura de Pastas

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
│   ├── js/                      # Módulos ES, um por responsabilidade.
│   │   ├── main.js              # Liga os cliques e inicializa o app.
│   │   ├── config.js            # Constantes (URLs, tamanho da box etc).
│   │   ├── state.js             # Estado do app (fonte única de verdade).
│   │   ├── dom.js                # Referências de elementos do HTML.
│   │   ├── toast.js             # Notificação retrô.
│   │   ├── pokeApi.js           # Acesso à PokéAPI.
│   │   ├── backendApi.js        # Acesso ao back-end da Carol.
│   │   ├── explorar.js          # Tela de exploração.
│   │   ├── capturar.js          # Animação e tentativa de captura.
│   │   ├── inventario.js        # Grade da Bag, boxes e seleção.
│   │   └── popup.js             # Popup do Pokémon selecionado.
│   └── assets/
│       ├── background.png       # Cenário da clareira.
│       └── ui/                  # Sprites e molduras pixel art.
│
├── screenshots/                 # Prints usados neste README.
│   ├── mapa.png
│   └── bag.png
├── DOCUMENTACAO.md              # Funcionalidades, fluxogramas e boas práticas.
├── LICENSE
└── README.md
```

## Fluxo de Dados

1. **Exploração:** o jogador clica em **"Explorar"**. O front-end gera um ID aleatório (1–151) e busca os dados do Pokémon diretamente na PokéAPI (`GET https://pokeapi.co/api/v2/pokemon/{id}`), exibindo nome, imagem e taxa de captura.

2. **Tentativa de captura:** o jogador clica em **"Capturar"**. O front-end dispara a animação e envia um `POST /api/capturar` ao back-end com os dados do Pokémon exibido na tela.

3. **Cálculo e persistência:** o back-end compara um valor aleatório (`random`) com a taxa de captura recebida. Em caso de sucesso, verifica se o Pokémon já está registrado na coleção. Caso ainda não exista, ele é inserido na tabela `inventario` (SQLite). Se já estiver registrado, o sistema apenas informa que o Pokémon já faz parte da coleção, evitando registros duplicados.

4. **Atualização do inventário:** após uma captura bem-sucedida, o front-end realiza um `GET /api/inventario` para sincronizar a coleção exibida na Bag.

5. **Tratamento de erros:** durante a execução das rotas da API, possíveis falhas são capturadas pelo back-end. Erros relacionados às operações internas são tratados para evitar que a aplicação seja interrompida, retornando respostas HTTP adequadas ao cliente quando necessário.

> **CORS:** o back-end utiliza `CORSMiddleware` para permitir que o front-end, servido em uma origem diferente, consuma a API local sem bloqueios do navegador. Em desenvolvimento, `allow_origins` está configurado como `"*"`. Em produção, recomenda-se restringir às origens autorizadas.

## Endpoints da API

| Método | Rota | Descrição | Resposta (exemplo) |
|--------|------|-----------|--------------------|
| **POST** | `/api/capturar` | Recebe os dados do Pokémon, executa o cálculo de captura e, em caso de sucesso, adiciona o Pokémon à coleção **caso ele ainda não faça parte do inventário**. Se o Pokémon já estiver registrado, ele não é duplicado no banco de dados. | `{"sucesso": true, "mensagem": "Pokémon capturado!"}`<br>`{"sucesso": true, "mensagem": "Este Pokémon já faz parte da sua coleção!"}`<br>`{"sucesso": false, "mensagem": "O Pokémon fugiu!"}` |
| **GET** | `/api/inventario` | Retorna todos os Pokémon registrados na coleção do jogador. | `[{"id":4,"nome":"Charmander","imagem":"url.gif"}]` |

## Como Executar

Dois terminais, um pra cada lado. Nenhum dos dois precisa de `sudo`.

**Back-end**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Servidor em `http://127.0.0.1:8000`. Documentação automática (e onde testar os endpoints direto) em `http://127.0.0.1:8000/docs`.

**Front-end**

```bash
cd frontend
python3 -m http.server 5500
```

Abra `http://127.0.0.1:5500` no navegador. (Precisa ser servido assim, e não aberto direto como arquivo `file://`, senão o navegador bloqueia as chamadas pro back-end por causa do CORS. Uma extensão tipo Live Server também funciona.)

> Com os dois rodando: explorar/capturar na tela já fala com o back-end de verdade e persiste no `backend/inventario.db` (criado automaticamente, não precisa mexer nele).

## Qualidade de Código

O front-end é organizado em módulos ES (`frontend/js/`), cada um com uma única
responsabilidade, nada de um arquivo só fazendo tudo:

- **Separação por responsabilidade:** telas (`explorar.js`, `capturar.js`,
  `inventario.js`, `popup.js`) não se misturam com acesso a dados
  (`pokeApi.js`, `backendApi.js`), nem com utilitários de UI (`toast.js`).
- **Fonte única de verdade:** `state.js` guarda todo o estado do app;
  `dom.js` é o único lugar que conhece os IDs do HTML.
- **DRY:** lógica repetida (ex.: extrair o sprite animado da PokéAPI) foi
  isolada numa função só, reaproveitada onde precisa.
- **Sem HTML acoplado a JS:** eventos são ligados via `addEventListener` em
  `main.js`, não em atributos `onclick` espalhados pelo HTML.
- **Nomes e constantes:** funções com nomes que dizem o que fazem, números
  "mágicos" (tempos de animação, tamanho da box) viraram constantes nomeadas.

Detalhes, tabela de funções e o diagrama de dependências entre os módulos
estão na [DOCUMENTACAO.md](./DOCUMENTACAO.md#arquitetura-do-front-end-js).

## Divisão de Responsabilidades

**Front-end (Deys)**

- Layout utilizando CSS Grid e bordas arredondadas.
- Consumo assíncrono da PokéAPI (IDs de 1 a 151).
- Animações da Pokébola, captura e fuga.
- Integração com o back-end (`POST` na captura e `GET` no inventário).

**Back-end (Carol)**

- Algoritmo de captura (`random` × taxa de captura).
- Persistência da coleção em SQLite (`inventario`).
- Prevenção de registros duplicados na coleção.
- Criação dos endpoints FastAPI.
- Tratamento de erros de banco utilizando `try`, `except` e `finally`.
- Tratamento de exceções HTTP utilizando `HTTPException`, retornando respostas adequadas para situações de erro durante o processamento das requisições.

O back-end mantém as regras de negócio centralizadas, garantindo que validações, cálculos de captura e operações no banco de dados sejam executados de forma controlada antes de retornar uma resposta ao front-end.

## Estratégia de Versionamento

Fluxo baseado em Feature Branches e Pull Requests, permitindo o desenvolvimento paralelo das funcionalidades e facilitando a revisão e integração do código ao repositório principal.

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](./LICENSE) para o texto completo.
