// Tentativa de captura: anima a pokébola e, em paralelo, pergunta pro back-end
// da Carol o resultado de verdade; o front nunca decide sozinho se pegou.
import { dom } from './dom.js';
import { state } from './state.js';
import { POKEBALL_BASE_CLASS } from './config.js';
import { capturarPokemon } from './backendApi.js';
import { showToast } from './toast.js';
import { atualizarInventario, irParaBoxDoPokemon, selecionarPokemon } from './inventario.js';

const DURACAO_ARREMESSO_MS = 500;
const DURACAO_ANIMACAO_MS = 2500;
const PAUSA_ANTES_DE_RESETAR_MS = 2000;

export async function tentarCapturar() {
    if (!state.currentPokemon || state.isCapturing) return;
    state.isCapturing = true;

    const pokemonCapturado = state.currentPokemon;

    dom.btnCatch.classList.add('hidden');
    dom.pokemonImage.classList.remove('pokemon-float');
    dom.pokeballImg.className = `${POKEBALL_BASE_CLASS} anim-throw`;

    setTimeout(() => {
        dom.pokemonImage.classList.add('hidden');
        dom.pokeballImg.className = `${POKEBALL_BASE_CLASS} anim-shake`;
    }, DURACAO_ARREMESSO_MS);

    // Dispara a chamada real pro back-end em paralelo com a animação,
    // pra já ter o resultado pronto quando o chacoalhar da pokébola terminar.
    const resultadoPromise = capturarPokemon({
        id: pokemonCapturado.id,
        nome: pokemonCapturado.nome,
        imagem: pokemonCapturado.imagem_inventario,
        capture_rate: pokemonCapturado.capture_rate,
    });

    setTimeout(async () => {
        const resultado = await resultadoPromise;
        dom.pokeballImg.classList.remove('anim-shake');

        await reagirAoResultado(resultado, pokemonCapturado);

        setTimeout(resetMapa, PAUSA_ANTES_DE_RESETAR_MS);
    }, DURACAO_ANIMACAO_MS);
}

async function reagirAoResultado(resultado, pokemonCapturado) {
    if (resultado.erroConexao) {
        // Servidor da Carol fora do ar: não é o Pokémon que fugiu, é a conexão.
        dom.pokemonImage.classList.remove('hidden');
        dom.pokeballImg.classList.add('hidden');
        showToast("SERVIDOR OFFLINE!", "error");
        return;
    }

    if (resultado.sucesso) {
        dom.pokeballImg.classList.add('anim-success');
        showToast(resultado.mensagem?.toUpperCase() || `${pokemonCapturado.nome.toUpperCase()} PEGO!`, "success");
        await atualizarInventario();
        irParaBoxDoPokemon(pokemonCapturado.id);
        selecionarPokemon({ id: pokemonCapturado.id, nome: pokemonCapturado.nome, imagem: pokemonCapturado.imagem_inventario });
        return;
    }

    dom.pokemonImage.classList.remove('hidden');
    dom.pokeballImg.classList.add('hidden');
    showToast(resultado.mensagem?.toUpperCase() || `${pokemonCapturado.nome.toUpperCase()} FUGIU!`, "error");
}

export function resetMapa() {
    state.isCapturing = false;
    state.currentPokemon = null;
    dom.encounterZone.classList.add('hidden');
    dom.btnCatch.classList.add('hidden');

    dom.btnExplore.innerHTML = '<span>▶ EXPLORAR</span>';
    dom.btnExplore.disabled = false;
    dom.btnExplore.classList.remove('hidden');

    dom.pokemonImage.classList.add('pokemon-float');
    dom.pokemonImage.classList.remove('hidden');
    dom.pokeballImg.className = `${POKEBALL_BASE_CLASS} hidden`;
}
