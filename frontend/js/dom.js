// Único lugar do app que sabe os IDs do HTML. Todo o resto importa `dom`
// e usa `dom.algumaCoisa`; se um ID mudar no index.html, só se mexe aqui.
export const dom = {
    // Mapa / encontro
    encounterZone: document.getElementById('encounter-zone'),
    pokemonImage: document.getElementById('pokemon-image'),
    pokemonName: document.getElementById('pokemon-name'),
    captureChanceBar: document.getElementById('capture-chance-bar'),
    captureRateLabel: document.getElementById('pokemon-capture-rate'),
    btnExplore: document.getElementById('btn-explore'),
    btnCatch: document.getElementById('btn-catch'),
    pokeballImg: document.getElementById('capture-pokeball'),

    // Bag / inventário
    inventoryGrid: document.getElementById('inventory-grid'),
    inventoryCount: document.getElementById('inventory-count'),
    statusName: document.getElementById('status-name'),
    boxLabel: document.getElementById('box-label'),
    btnBoxPrev: document.getElementById('btn-box-prev'),
    btnBoxNext: document.getElementById('btn-box-next'),

    // Popup do Pokémon selecionado
    pokemonPopup: document.getElementById('pokemon-popup'),
    popupSprite: document.getElementById('popup-pokemon-sprite'),
    popupName: document.getElementById('popup-pokemon-name'),
    popupCloseBtn: document.getElementById('popup-close-btn'),

    // Notificações
    toastContainer: document.getElementById('toast-container'),
};
