const catalog = document.getElementById('main-catalog');
const popup = document.getElementById('popup-resumo');
let limiteAtual = 0;
window.precoSelecionado = "29,90"; // Valor padrão de segurança

// 1. Seleção do Plano (VERSÃO CORRIGIDA)
document.querySelectorAll('.btn-plan').forEach(button => {
    button.addEventListener('click', function() {
        const planCard = this.parentElement;
        const planName = planCard.querySelector('h3').innerText.toUpperCase();
        
        // --- LIMPEZA DO PREÇO (PEGA O VALOR REAL DA OFERTA) ---
        // Criamos um clone para mexer no texto sem estragar o visual do site
        let precoElemento = planCard.querySelector('.price');
        let precoClone = precoElemento.cloneNode(true);
        
        // Remove o preço antigo riscado (ex: R$ 333,00) para não confundir o sistema
        const oldPrice = precoClone.querySelector('.old-price');
        if (oldPrice) oldPrice.remove();
        
        // Agora pegamos apenas os números e a vírgula do que sobrou
        let textoFinal = precoClone.innerText;
        let valorEncontrado = textoFinal.match(/\d+,\d+/);
        
        if (valorEncontrado) {
            window.precoSelecionado = valorEncontrado[0];
        }

        // Define os limites de jogos
        if (planName.includes("BASICO")) limiteAtual = 1;
        else if (planName.includes("PLUS")) limiteAtual = 5;
        else if (planName.includes("PREMIUM")) limiteAtual = 15;
        else if (planName.includes("ULTIMATE")) {
            // Ultimate vai direto para o checkout com valor fixo
            window.location.href = `https://gameflix2.github.io/CHECKOUT-GAMEFLIX--PAY/?valor=199,90`;
            return;
        }

        // Limpa seleções anteriores e abre o catálogo
        document.querySelectorAll('.game-item.selected').forEach(el => el.classList.remove('selected'));
        catalog.classList.add('active');
        document.getElementById('catalog-title').innerText = `ESCOLHA SEUS JOGOS (LIMITE: ${limiteAtual})`;

        setTimeout(() => {
            catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
    });
});

// 2. Seleção de Jogos e Abertura Automática do Resumo
document.addEventListener('click', function (e) {
    const gameItem = e.target.closest('.game-item');
    if (gameItem && catalog.classList.contains('active')) {
        
        if (gameItem.classList.contains('selected')) {
            gameItem.classList.remove('selected');
        } else {
            const selecionados = document.querySelectorAll('.game-item.selected').length;

            if (selecionados < limiteAtual) {
                gameItem.classList.add('selected');
                
                // Abre o resumo automaticamente ao atingir o limite
                const totalAgora = document.querySelectorAll('.game-item.selected').length;
                if (totalAgora === limiteAtual) {
                    setTimeout(mostrarResumo, 600);
                }
            } else {
                alert(`Você já escolheu seus ${limiteAtual} jogos!`);
            }
        }
    }
});

// 3. Gerar resumo e injetar o Link com Valor Correto
function mostrarResumo() {
    const selecionados = document.querySelectorAll('.game-item.selected');
    const listaDiv = document.getElementById('lista-resumo');
    const btnCheckout = document.querySelector('.btn-checkout');
    
    listaDiv.innerHTML = ""; 

    selecionados.forEach((item) => {
        const imgLink = item.querySelector('img').src;
        listaDiv.innerHTML += `<img src="${imgLink}" class="resumo-img-pop">`;
    });

    // A MÁGICA: Injeta o valor capturado no link do botão de pagamento
    btnCheckout.href = `https://gameflix2.github.io/CHECKOUT-GAMEFLIX--PAY/?valor=${window.precoSelecionado}`;

    popup.style.display = 'flex';
}

// Função para fechar o popup se o cliente quiser trocar os jogos
window.fecharPopup = function() {
    popup.style.display = 'none';
}
