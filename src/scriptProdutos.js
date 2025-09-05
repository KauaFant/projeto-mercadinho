// Seleciona o botão e a seção de produtos
const btnListar = document.getElementById("btn-listar-produtos");
const produtosDestaque = document.getElementById("produtos-destaque");

// Adiciona o evento de clique
btnListar.addEventListener("click", () => {
  // Alterna entre mostrar e esconder a seção de produtos
  if (produtosDestaque.style.display === "none") {
    produtosDestaque.style.display = "block";
    btnListar.textContent = "Ocultar Produtos"; // muda o texto do botão
  } else {
    produtosDestaque.style.display = "none";
    btnListar.textContent = "Listar Produtos"; // volta o texto original
  }
});


async function ListarProdutos() {
    const res = await fetch('http://localhost:8081/produtos');
    const produtos = await res.json();

    const grid = document.getElementById("grid-produtos-destaque");
    grid.innerHTML = ""; // limpa antes de renderizar de novo

    produtos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("produto");
        div.dataset.id = p.id;

        div.innerHTML = `
            <img src="${p.imagem}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p>R$ ${p.preco}</p>
            <small>ID: ${p.id}</small>
            <button>Comprar</button>
        `;
        grid.appendChild(div);
    });
}

async function adicionarProduto() {
    const nome = document.getElementById("produto-nome").value;
    const preco = document.getElementById("produto-preco").value;
    const imagem = document.getElementById("produto-imagem").value;

    if (!nome || !preco || !imagem) {
        alert("Preencha todos os campos!");
        return;
    }

    await fetch('http://localhost:8081/produtos', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, imagem })
    });

    ListarProdutos();

    // Limpa os campos
    document.getElementById("produto-nome").value = "";
    document.getElementById("produto-preco").value = "";
    document.getElementById("produto-imagem").value = "";
}

async function atualizarProduto() {
    const id = document.getElementById("id-update").value;
    const nome = document.getElementById("desc-update").value;
    const preco = document.getElementById("preco-update").value;
    const imagem = document.getElementById("imagem-update").value;

    if (!id || !nome || !preco || !imagem) {
        alert("Preencha todos os campos: ID, nome, preço e imagem!");
        return;
    }

    const res = await fetch(`http://localhost:8081/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, preco, imagem })
    });

    if (res.status === 404) {
        // Produto fixo → altera no DOM
        const produtoDiv = document.querySelector(`.produto[data-id="${id}"]`);
        if (produtoDiv) {
            produtoDiv.querySelector("h3").textContent = nome;
            produtoDiv.querySelector("p").textContent = `R$ ${preco}`;
            produtoDiv.querySelector("img").src = imagem;
        }
    }

    ListarProdutos();

    // Limpa os campos
    document.getElementById("id-update").value = "";
    document.getElementById("desc-update").value = "";
    document.getElementById("preco-update").value = "";
    document.getElementById("imagem-update").value = "";
}

async function deletarProduto() {
    const id = document.getElementById("id-delete").value.trim();
    if (!id) {
      alert("Informe o ID para deletar!");
      return;
    }
  
    // tenta deletar no backend
    let notFound = false;
    try {
      const res = await fetch(`http://localhost:8081/produtos/${id}`, { method: "DELETE" });
      if (res.status === 404) notFound = true;
    } catch (e) {
      // se der erro de rede, vamos pelo DOM mesmo
      console.error(e);
      notFound = true;
    }
  
    // remove do DOM (funciona pra fixos 101–106 e também pros adicionados)
    const node = document.querySelector(`.produto[data-id="${id}"]`);
    if (node) {
      node.remove();
    } else if (notFound) {
      alert(`Produto ${id} não encontrado no DOM nem no backend.`);
    }
  
    // repopula os produtos adicionados do backend (mantém os fixos intocados)
    ListarProdutos();
    document.getElementById("id-delete").value = "";
  }

const inputBusca = document.getElementById("busca-produtos");

inputBusca.addEventListener("input", async () => {
    const termo = inputBusca.value.toLowerCase();

    // Pega todos os produtos do backend
    const res = await fetch('http://localhost:8081/produtos');
    const produtos = await res.json();

    const grid = document.getElementById("grid-produtos-destaque");
    grid.innerHTML = "";

    // Filtra produtos que contenham o termo no nome
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));

    filtrados.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("produto");
        div.dataset.id = p.id;

        div.innerHTML = `
            <img src="${p.imagem}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p>R$ ${p.preco}</p>
            <small>ID: ${p.id}</small>
            <button>Comprar</button>
        `;
        grid.appendChild(div);
    });

    // Mostra a seção de produtos caso esteja oculta
    if (produtosDestaque.style.display === "none") {
        produtosDestaque.style.display = "block";
    }
});