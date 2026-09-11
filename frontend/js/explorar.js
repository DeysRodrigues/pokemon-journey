// Tela de exploração: sorteia um Pokémon selvagem e preenche o card de encontro.
import { dom } from './dom.js';
import { state } from './state.js';
import { buscarPokemonSelvagem } from './pokeApi.js';
import { showToast } from './toast.js';

export async function exploreMundo() {
    if (state.isCapturing) return;

    iniciarBusca();

    try {
        const pokemon = await buscarPokemonSelvagem();
        state.currentPokemon = pokemon;
        mostrarEncontro(pokemon);
    } catch (error) {
        showToast("ERRO DE CONEXAO!", "error");
        cancelarBusca();
    }
}

function iniciarBusca() {
    dom.btnExplore.innerHTML = '<span>BUSCANDO...</span>';
    dom.btnExplore.disabled = true;
    dom.encounterZone.classList.add('hidden');
    dom.btnCatch.classList.add('hidden');
    dom.pokeballImg.classList.add('hidden');
}

function cancelarBusca() {
    dom.btnExplore.innerHTML = '<span>▶ EXPLORAR</span>';
    dom.btnExplore.disabled = false;
}

function mostrarEncontro(pokemon) {
    dom.pokemonName.innerText = pokemon.nome;
    dom.pokemonImage.src = pokemon.imagem_batalha;

    const chancePct = Math.round((pokemon.capture_rate / 255) * 100);
    dom.captureChanceBar.style.width = `${chancePct}%`;
    dom.captureRateLabel.innerText = `${chancePct}%`; // o card já traz "CHANCE:" impresso na arte

    dom.pokemonImage.onload = () => {
        dom.encounterZone.classList.remove('hidden');
        dom.btnExplore.classList.add('hidden');
        dom.btnCatch.classList.remove('hidden');
    };
}
