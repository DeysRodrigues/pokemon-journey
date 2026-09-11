// Ponto de entrada: liga os cliques da tela às funções de cada módulo e
// sincroniza a Bag com o back-end assim que a página abre.
import { dom } from './dom.js';
import { exploreMundo } from './explorar.js';
import { tentarCapturar } from './capturar.js';
import { mudarBox, atualizarInventario } from './inventario.js';
import { fecharPopup } from './popup.js';

dom.btnExplore.addEventListener('click', exploreMundo);
dom.btnCatch.addEventListener('click', tentarCapturar);
dom.btnBoxPrev.addEventListener('click', () => mudarBox(-1));
dom.btnBoxNext.addEventListener('click', () => mudarBox(1));
dom.popupCloseBtn.addEventListener('click', fecharPopup);

atualizarInventario();
