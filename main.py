from fastapi import FastAPI
from pydantic import BaseModel

from game_logic import calcular_captura
from database import criar_tabela, inserir_pokemon, buscar_inventario

app = FastAPI()

criar_tabela()

class PokemonParaCapturar(BaseModel):
    id: int
    nome: str
    imagem: str
    capture_rate: int

@app.post("/api/capturar")
def capturar(pokemon: PokemonParaCapturar):
    sucesso = calcular_captura(pokemon.capture_rate)

    if sucesso:
        inserir_pokemon(pokemon.id, pokemon.nome, pokemon.imagem)
        return {"sucesso": True, "mensagem": "Capturado!"}

    return {"sucesso": False, "mensagem": "O Pokémon fugiu!"}


@app.get("/api/inventario")
def inventario():
    return buscar_inventario()