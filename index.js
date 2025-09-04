const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

let produtos = [
    { id: 1, nome: "Feijão" },
    { id: 2, nome: "Arroz 5kg" }
];

// Servir arquivos estáticos da pasta src
app.use(express.static(path.join(__dirname, 'src')));

// Rotas de páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/saibamais', (req,res) => {
    res.sendFile(path.join(__dirname, 'src', 'saibamais.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'contato.html'));
});

// Rotas de produtos (API)
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

app.post('/produtos', (req, res) => {
    const { nome, preco, imagem } = req.body;
    const novo = { id: produtos.length + 1, nome, preco, imagem };
    produtos.push(novo);
    res.status(201).json(novo);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });
    produto.nome = req.body.nome;
    res.json(produto);
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    produtos = produtos.filter(p => p.id !== id);
    res.json({ mensagem: `Produto ${id} removido` });
});

// Start do servidor
app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8081: http://localhost:8081");
});
