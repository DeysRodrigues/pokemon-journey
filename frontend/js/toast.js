import { dom } from './dom.js';

// Toast de notificação estilo janela de diálogo clássica.
export function showToast(message, type = "success") {
    const toast = document.createElement('div');

    // Box escuro com borda dourada, seguindo a paleta do app
    toast.className = `bg-[#14302a] text-[#f6efd8] p-4 border-4 border-[#eab654] text-xs uppercase flex items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)] transform -translate-y-4 opacity-0 transition-all duration-200`;

    const icon = type === 'success' ? '★ ' : '⚠ ';

    toast.innerHTML = `<span class="leading-relaxed"><span class="text-[#eab654]">${icon}</span> ${message}</span>`;

    dom.toastContainer.appendChild(toast);

    // Entrada dura (sem muita suavidade para manter o estilo retro)
    setTimeout(() => {
        toast.classList.remove('-translate-y-4', 'opacity-0');
    }, 50);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 200);
    }, 3000);
}
