from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from game_logic import calcular_captura
from database import criar_tabela, inserir_pokemon, buscar_inventario


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restringir para a origem do front-end
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


criar_tabela()


class PokemonParaCapturar(BaseModel):
    id: int
    nome: str
    imagem: str
    capture_rate: int


@app.post("/api/capturar")
def capturar(pokemon: PokemonParaCapturar):

    try:

        sucesso = calcular_captura(pokemon.capture_rate)

        if not sucesso:
            return {
                "sucesso": False,
                "mensagem": "O Pokémon fugiu!"
            }


        inserido = inserir_pokemon(
            pokemon.id,
            pokemon.nome,
            pokemon.imagem
        )


        if inserido:
            return {
                "sucesso": True,
                "mensagem": "Pokémon capturado!"
            }


        return {
            "sucesso": True,
            "mensagem": "Este Pokémon já faz parte da sua coleção!"
        }


    except Exception as erro:

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar captura: {erro}"
        )


@app.get("/api/inventario")
def inventario():

    try:

        return buscar_inventario()


    except Exception as erro:

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao carregar inventário: {erro}"
        )