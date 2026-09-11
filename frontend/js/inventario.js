// Grade da Bag: busca o inventário no back-end, desenha os slots (paginados em
// boxes de 9, igual o PC do Professor Carvalho nos jogos) e cuida da seleção.
import { dom } from './dom.js';
import { state } from './state.js';
import { ITENS_POR_BOX } from './config.js';
import { buscarInventarioRemoto } from './backendApi.js';
import { abrirPopupPokemon } from './popup.js';

export async function atualizarInventario() {
    try {
        state.inventario = await buscarInventarioRemoto();
    } catch (error) {
        // Servidor fora do ar: mantém o que já estava na tela em vez de zerar.
    }
    renderizarInventario();
}

export function renderizarInventario() {
    dom.inventoryCount.innerText = state.inventario.length;

    const totalBoxes = Math.max(1, Math.ceil(state.inventario.length / ITENS_POR_BOX));
    state.boxAtual = Math.min(Math.max(state.boxAtual, 0), totalBoxes - 1);

    dom.boxLabel.innerText = `BOX ${state.boxAtual + 1} / ${totalBoxes}`;
    dom.btnBoxPrev.disabled = state.boxAtual === 0;
    dom.btnBoxNext.disabled = state.boxAtual >= totalBoxes - 1;

    dom.inventoryGrid.innerHTML = '';

    const inicio = state.boxAtual * ITENS_POR_BOX;
    const visiveis = state.inventario.slice(inicio, inicio + ITENS_POR_BOX);

    for (let i = 0; i < ITENS_POR_BOX; i++) {
        dom.inventoryGrid.appendChild(criarSlot(visiveis[i]));
    }

    // Se nada estiver selecionado ainda (ou o selecionado não está nesta box), seleciona o primeiro da box atual.
    if (visiveis.length > 0 && !visiveis.some((p) => state.pokemonSelecionado && p.id === state.pokemonSelecionado.id)) {
        selecionarPokemon(visiveis[0]);
    } else if (state.inventario.length === 0) {
        selecionarPokemon(null);
    }
}

function criarSlot(poke) {
    const slot = document.createElement('div');
    slot.className = 'slot';

    if (!poke) {
        slot.classList.add('empty');
        slot.innerHTML = `<img src="assets/ui/items/pokeball.png" alt="">`;
        return slot;
    }

    slot.classList.add('filled');
    slot.dataset.id = poke.id;
    if (state.pokemonSelecionado && state.pokemonSelecionado.id === poke.id) {
        slot.classList.add('selected');
    }
    slot.innerHTML = `
        <img src="${poke.imagem}" alt="${poke.nome}">
        <span class="tooltip">${poke.nome}</span>
    `;
    slot.addEventListener('click', () => {
        selecionarPokemon(poke);
        abrirPopupPokemon(poke);
    });
    return slot;
}

// --- NAVEGAÇÃO ENTRE BOXES ---
export function mudarBox(delta) {
    state.boxAtual += delta;
    renderizarInventario();
}

export function irParaBoxDoPokemon(id) {
    const index = state.inventario.findIndex((p) => p.id === id);
    if (index === -1) return;
    state.boxAtual = Math.floor(index / ITENS_POR_BOX);
    renderizarInventario();
}

// Marca um Pokémon como selecionado (borda de destaque no slot + nome na placa da Bag).
export function selecionarPokemon(poke) {
    state.pokemonSelecionado = poke;

    dom.inventoryGrid.querySelectorAll('.slot').forEach((slot) => slot.classList.remove('selected'));

    if (!poke) {
        dom.statusName.innerText = '';
        return;
    }

    dom.statusName.innerText = poke.nome.toUpperCase();

    const slotCorrespondente = dom.inventoryGrid.querySelector(`.slot[data-id="${poke.id}"]`);
    if (slotCorrespondente) slotCorrespondente.classList.add('selected');
}
