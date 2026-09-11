// Constantes globais do app. Nenhuma lógica aqui, só valores fixos.

// URL do back-end da Carol (FastAPI). Ajustar se rodar em outra porta/host.
export const API_BASE_URL = "http://127.0.0.1:8000";

export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// Kanto vai do Pokémon 1 ao 151; é o range que a exploração sorteia.
export const KANTO_MAX_ID = 151;

// Classes Tailwind "de repouso" da pokébola de captura (sem nenhuma animação aplicada).
export const POKEBALL_BASE_CLASS = 'w-10 h-10 absolute bottom-[16%] left-1/2 -translate-x-1/2 z-20';

// Quantos espaços cabem numa box da Bag (grade 3x3).
export const ITENS_POR_BOX = 9;
