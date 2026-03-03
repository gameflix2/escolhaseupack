const catalog = document.getElementById('main-catalog');
const popup = document.getElementById('popup-resumo');
let limiteAtual = 0;

// 1. Seleção do Plano (VERSÃO CORRIGIDA)
document.querySelectorAll('.btn-plan').forEach(button => {
    button.addEventListener('click', function() {
        const planCard = this.parentElement;
        const planName = planCard.querySelector('h3').innerText.toUpperCase();
        
        // --- INÍCIO DA LIMPEZA DO PREÇO ---
        let precoElemento = planCard.querySelector('.price');
        let precoClone = precoElemento.cloneNode(true);
        const oldPrice = precoClone.querySelector('.old-price');
        if (oldPrice) oldPrice.remove(); // Remove o preço riscado (ex: 333,00)
        
        let precoLimpo = precoClone.innerText.replace('R$', '').replace('/único', '').trim();
        window.precoSelecionado = precoLimpo; // Agora só sobra o valor real (ex: 99,90)
        // --- FIM DA LIMPEZA ---

        if (planName.includes("BASICO")) limiteAtual = 1;
        else if (planName.includes("PLUS")) limiteAtual = 5;
        else if (planName.includes("PREMIUM")) limiteAtual = 15;
        else if (planName.includes("ULTIMATE")) {
            window.location.href = `https://gameflix2.github.io/CHECKOUT-GAMEFLIX--PAY/?valor=199,90`;
            return;
        }

        document.querySelectorAll('.game-item.selected').forEach(el => el.classList.remove('selected'));
        catalog.classList.add('active');
        document.getElementById('catalog-title').innerText = `ESCOLHA SEUS JOGOS (LIMITE: ${limiteAtual})`;

        setTimeout(() => {
            catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    });
});

// 2. Seleção de Jogos e Abertura Automática
document.addEventListener('click', function (e) {
    const gameItem = e.target.closest('.game-item');
    if (gameItem && catalog.classList.contains('active')) {
        
        if (gameItem.classList.contains('selected')) {
            gameItem.classList.remove('selected');
        } else {
            const selecionados = document.querySelectorAll('.game-item.selected').length;

            if (selecionados < limiteAtual) {
                gameItem.classList.add('selected');
                
                // Abre o popup quando atinge o limite
                const totalAgora = document.querySelectorAll('.game-item.selected').length;
                if (totalAgora === limiteAtual) {
                    setTimeout(mostrarResumo, 600);
                }
            } else {
                alert(`Limite de ${limiteAtual} atingido!`);
            }
        }
    }
});

// 3. Gerar resumo com Fotos e Link de Pagamento
function mostrarResumo() {
    const selecionados = document.querySelectorAll('.game-item.selected');
    const listaDiv = document.getElementById('lista-resumo');
    const btnCheckout = document.querySelector('.btn-checkout'); // O botão do seu popup
    
    listaDiv.innerHTML = ""; 

    selecionados.forEach((item) => {
        const imgLink = item.querySelector('img').src;
        listaDiv.innerHTML += `<img src="${imgLink}" class="resumo-img-pop">`;
    });

    // Injeta o valor no link final
    btnCheckout.href = `https://gameflix2.github.io/CHECKOUT-GAMEFLIX--PAY/?valor=${window.precoSelecionado}`;

    popup.style.display = 'flex';
}
