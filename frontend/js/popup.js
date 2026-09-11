// Popup do Pokémon selecionado: abre ao lado da Bag ao clicar num capturado,
// sem cobrir o resto da tela (não é modal).
import { dom } from './dom.js';
import { state } from './state.js';
import { buscarSpriteAnimadoPorId } from './pokeApi.js';

export async function abrirPopupPokemon(poke) {
    // Clicar de novo no mesmo Pokémon fecha o popup (alterna aberto/fechado).
    if (state.popupAbertoParaId === poke.id && !dom.pokemonPopup.classList.contains('hidden')) {
        fecharPopup();
        return;
    }

    state.popupAbertoParaId = poke.id;
    dom.popupName.innerText = poke.nome.toUpperCase();
    dom.popupSprite.src = poke.imagem; // sprite estática, já disponível na hora
    dom.pokemonPopup.classList.remove('hidden');

    // Tenta trocar pela versão animada (Gen V), sem travar a abertura do popup.
    const animado = await buscarSpriteAnimadoPorId(poke.id);
    // Só troca se o popup ainda for desse mesmo Pokémon (evita corrida se clicar rápido em outro).
    if (animado && state.popupAbertoParaId === poke.id) {
        dom.popupSprite.src = animado;
    }
}

export function fecharPopup() {
    state.popupAbertoParaId = null;
    dom.pokemonPopup.classList.add('hidden');
}
