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

    const grid = document.querySelector("#produtos-destaque .grid-produtos");
    
    // Mantém os produtos já existentes, mas remove apenas os produtos adicionados antes
    const produtosAdicionados = grid.querySelectorAll(".produto.adicionado");
    produtosAdicionados.forEach(p => p.remove());

    produtos.forEach(p => {
        // Cria um produto somente se ainda não existe
        if (!grid.querySelector(`.produto[data-id="${p.id}"]`)) {
            const div = document.createElement("div");
            div.classList.add("produto", "adicionado"); // marca como adicionado
            div.dataset.id = p.id; // identifica o produto
            div.innerHTML = `
                <img src="${p.imagem}" alt="${p.nome}">
                <h3>${p.nome}</h3>
                <p>R$ ${p.preco}</p>
                <button>Comprar</button>
            `;
            grid.appendChild(div);
        }
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
    await fetch(`http://localhost:8081/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome })
    });
    ListarProdutos();
    document.getElementById("id-update").value = "";
    document.getElementById("desc-update").value = "";
}

async function deletarProduto() {
    const id = document.getElementById("id-delete").value;
    await fetch(`http://localhost:8081/produtos/${id}`, { method: "DELETE" });
    ListarProdutos();
    document.getElementById("id-delete").value = "";
}