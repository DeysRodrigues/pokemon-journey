// Estado do app inteiro, num objeto só, importado por quem precisa ler/mudar
// alguma coisa. Não tem lógica aqui, só os dados que mudam durante o uso.
export const state = {
    currentPokemon: null,      // Pokémon selvagem atual (da tela de Explorar)
    isCapturing: false,        // true enquanto a animação/captura está rolando
    inventario: [],            // lista de Pokémon capturados, vinda do back-end
    pokemonSelecionado: null,  // Pokémon marcado na grade da Bag
    boxAtual: 0,                // 0-indexado; cada box tem ITENS_POR_BOX espaços
    popupAbertoParaId: null,   // id do Pokémon com popup aberto (null = fechado)
};
