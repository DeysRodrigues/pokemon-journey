// Tudo que fala com o back-end da Carol (FastAPI) mora aqui.
import { API_BASE_URL } from './config.js';

// Envia o Pokémon pro back-end decidir (de verdade) se a captura deu certo.
// Nunca rejeita: se a rede/servidor falhar, devolve um resultado com
// `erroConexao: true` pra quem chamou tratar como um caso à parte de "fugiu".
export async function capturarPokemon(pokemon) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/capturar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pokemon),
        });
        if (!res.ok) throw new Error('Erro no back-end');
        return await res.json();
    } catch (error) {
        return { sucesso: false, mensagem: null, erroConexao: true };
    }
}

// Busca a coleção completa de Pokémon capturados.
export async function buscarInventarioRemoto() {
    const res = await fetch(`${API_BASE_URL}/api/inventario`);
    if (!res.ok) throw new Error('Erro ao buscar inventário');
    return await res.json();
}
