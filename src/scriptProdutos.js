async function ListarAvaliacao() {
    const res = await fetch('http://localhost:8080/produtos');
    const avalicoes = await res.json();
    const lista = document.getElementById("lista-avaliacao");
    lista.innerHTML = "";
    avalicoes.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.id} - ${a.desc}`;
        lista.appendChild(li);
    });
}

async function adicionarAvaliacao() {
    const av = document.getElementById("produtos").value;
    await fetch('http://localhost:8080/produtos', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({av})
    });
    ListarAvaliacao();
}

async function atualizarAvaliacao() {
    const id = document.getElementById("id-update").value;
    const desc = document.getElementById("desc-update").value;
    await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({desc})
    });
    ListarAvaliacao();
}

async function deletarAvaliacao() {
    const id = document.getElementById("id-delete").value;
    await fetch(`http://localhost:8080/produtos/${id}`, {
        method: "DELETE",
    });
    ListarAvaliacao();
}
