// Tudo que fala com a PokéAPI pública mora aqui. O resto do app não sabe
// (nem precisa saber) o formato da resposta da PokéAPI; só chama essas funções.
import { POKEAPI_BASE_URL, KANTO_MAX_ID } from './config.js';

function idPokemonAleatorio() {
    return Math.floor(Math.random() * KANTO_MAX_ID) + 1;
}

// A PokéAPI só tem sprite animado (Geração 5) pra parte dos Pokémon, e o campo
// pode nem existir dependendo da espécie; daí o try/catch. Centralizado aqui
// porque tanto a exploração quanto o popup da Bag precisavam da mesma lógica.
function extrairSpriteAnimado(pokemonData) {
    try {
        return pokemonData.sprites.versions['generation-v']['black-white'].animated.front_default || null;
    } catch (error) {
        return null;
    }
}

// Busca um Pokémon selvagem aleatório (1-151) com os dados que a tela de
// Explorar precisa: sprites, nome e a chance de captura real da espécie.
export async function buscarPokemonSelvagem() {
    const id = idPokemonAleatorio();

    const [pokemonRes, speciesRes] = await Promise.all([
        fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`),
        fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`),
    ]);
    const data = await pokemonRes.json();
    const species = await speciesRes.json();

    return {
        id: data.id,
        nome: data.name,
        imagem_batalha: extrairSpriteAnimado(data) || data.sprites.front_default,
        imagem_inventario: data.sprites.front_default,
        capture_rate: species.capture_rate, // 0-255, usado pelo back-end da Carol
    };
}

// Busca só o sprite animado de um Pokémon pelo id (usado no popup da Bag, que já
// tem a sprite estática à mão e só quer tentar trocar por uma versão melhor).
export async function buscarSpriteAnimadoPorId(id) {
    try {
        const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);
        const data = await res.json();
        return extrairSpriteAnimado(data);
    } catch (error) {
        return null;
    }
}
