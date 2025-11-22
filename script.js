let cardConteiner = document.querySelector(".card-conteiner");
let inputBusca = document.querySelector("#input-busca");
let dados = [];

async function carregarDados() {
    let resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizaCards(dados);
}

function buscar() {
    let termoBusca = inputBusca.value.toLowerCase();

    if (termoBusca) {
        let dadosFiltrados = dados.filter(dado => 
            dado.nome.toLowerCase().includes(termoBusca) || 
            dado.descricao.toLowerCase().includes(termoBusca)
        );
        renderizaCards(dadosFiltrados);
    } else {
        renderizaCards(dados);
    }
}

function renderizaCards(dados) {
    cardConteiner.innerHTML = "";
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.descricao}</p>
        <p>${dado.data_criacao}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardConteiner.appendChild(article);
    }
}

carregarDados();