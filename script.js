/**
 * CURVA 73 - MAIN SCRIPT
 * Funcionalidades: Smooth Scroll, Parallax, Efeitos de Botão e Menu Mobile.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar todas as funções
    initSmoothScroll();
    initParallaxEffect();
    initButtonEffects();
    initMobileMenu();
});

/* --- 1. NAVEGAÇÃO SUAVE (SMOOTH SCROLL) --- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Apenas previne se o link for um âncora interno válido
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                // Fecha o menu mobile se estiver aberto ao clicar num link
                const nav = document.querySelector('nav');
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }

                // Calcula a posição considerando a altura do Header fixo
                const headerOffset = 80; 
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/* --- 2. EFEITO PARALLAX NO HERO --- */
function initParallaxEffect() {
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');

    if (!heroContent || !heroSection) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        // Só executa a animação se ainda estivermos vendo a área do hero
        if (scrollPosition < heroHeight) {
            // Move o texto para baixo em uma velocidade menor que o scroll (0.4x)
            // Isso cria a sensação de profundidade
            heroContent.style.transform = `translateY(${scrollPosition * 0.4}px)`;
            
            // Diminui a opacidade conforme rola para baixo
            heroContent.style.opacity = 1 - (scrollPosition / (heroHeight * 0.8));
        }
    });
}

/* --- 3. EFEITOS VINTAGE NOS BOTÕES --- */
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        // Simula o "afundar" de um botão físico antigo
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95) translateY(2px)';
        });

        // Retorna ao estado original (com o hover do CSS já aplicado)
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'translateY(-2px)'; // Mantém o lift do hover definido no CSS
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = ''; // Limpa transformações inline para o CSS assumir
        });
    });
}

/* --- 4. MENU MOBILE (LÓGICA + ESTILO INJETADO) --- */
function initMobileMenu() {
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const nav = document.querySelector('nav');

    if (!menuIcon || !nav) return;

    // Como o CSS original não tinha classes para o menu aberto, 
    // vamos injetar esse estilo dinamicamente para não precisar editar o arquivo .css
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @media (max-width: 768px) {
            nav.active {
                display: block !important;
                position: absolute;
                top: 100%; /* Logo abaixo do header */
                left: 0;
                width: 100%;
                background-color: var(--color-primary);
                padding: 20px 0;
                border-bottom: 4px solid var(--color-accent);
                animation: slideDown 0.3s ease forwards;
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            }
            
            nav.active ul {
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
            }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Evento de Click
    menuIcon.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        // Muda o ícone visualmente (opcional)
        if (nav.classList.contains('active')) {
            menuIcon.innerHTML = '&times;'; // Vira um X
        } else {
            menuIcon.innerHTML = '&#9776;'; // Vira o Hambúrguer
        }
    });
}

/* --- 5. CARREGAMENTO DINÂMICO DE DADOS (JSON) --- */
async function loadVehicles() {
    const grid = document.querySelector('.grid-container');
    // Verifica se o elemento existe antes de tentar preencher
    if(!grid) return;

    try {
        const response = await fetch('veiculos.json');
        if (!response.ok) throw new Error('Erro ao carregar JSON');
        
        const data = await response.json();
        
        // Limpa o conteúdo "hardcoded" do HTML para dar lugar ao conteúdo do JSON
        // Se preferir manter os do HTML e apenas adicionar, remova a linha abaixo.
        grid.innerHTML = ''; 

        data.veiculos.forEach(carro => {
            const cardHTML = `
                <article class="card">
                    <div class="card-image">
                        <img src="${carro.imagem_url}" alt="${carro.modelo}">
                    </div>
                    <div class="card-content">
                        <h3>${carro.modelo}</h3>
                        <p>${carro.descricao}</p>
                        <button class="btn">${carro.botao_texto}</button>
                    </div>
                </article>
            `;
            grid.innerHTML += cardHTML;
        });
        
        // Reaplica os efeitos visuais nos novos botões criados
        initButtonEffects(); 

    } catch (error) {
        console.log('Usando conteúdo estático do HTML (JSON não carregado ou rodando local sem servidor).');
    }
}

// Adicione esta chamada dentro do 'DOMContentLoaded' no início do script.js
// loadVehicles();
