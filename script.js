const catalog = document.getElementById('main-catalog');
const popup = document.getElementById('popup-resumo');
let limiteAtual = 0;

// 1. Seleção do Plano
document.querySelectorAll('.btn-plan').forEach(button => {
    button.addEventListener('click', function() {
        const planName = this.parentElement.querySelector('h3').innerText.toUpperCase();
        
        if (planName.includes("BASICO")) limiteAtual = 1;
        else if (planName.includes("PLUS")) limiteAtual = 5;
        else if (planName.includes("PREMIUM")) limiteAtual = 15;
        else if (planName.includes("ULTIMATE")) {
            window.location.href = "https://gameflix2.github.io/CHECKOUT-GAMEFLIX--PAY/";
            return;
        }

        // Limpa tudo para começar novo pedido
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

// 3. Gerar resumo com Fotos
function mostrarResumo() {
    const selecionados = document.querySelectorAll('.game-item.selected');
    const listaDiv = document.getElementById('lista-resumo');
    listaDiv.innerHTML = ""; 

    selecionados.forEach((item) => {
        const imgLink = item.querySelector('img').src;
        listaDiv.innerHTML += `<img src="${imgLink}" class="resumo-img-pop">`;
    });

    popup.style.display = 'flex';
}

function fecharPopup() {
    popup.style.display = 'none';
}