const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
let avaliacoes = [
    { id: 1, desc: "Radical!" },
    { id: 2, desc: "Parabéns" }
];
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});
app.get('/produtos', (req, res) => {
    res.json(avaliacoes);
});



app.get('/saibamais', (req,res) => {
    res.sendFile(path.join(__dirname, 'src', 'saibamais.html'));
});

app.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'contato.html'));
});

app.get('/', async (req,res) => {
    res.send("Página Inicial");
});

app.post('/produtos', (req, res) => {
    const novo={id: avaliacoes.length + 1, desc: req.body.av};
    avaliacoes.push(novo);
    res.status(201).json(novo);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const avaliacao = avaliacoes.find(av => av.id === id);
    if (!avaliacao) return res.status(404).json({erro:"Erro" });
    avaliacao.desc = req.body.desc;
    res.json(avaliacao);
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    avaliacoes = avaliacoes.filter(av => av.id !== id);
    res.json({ mensagem: `Avalição ${id} removida `});
});

app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8081: http://localhost:8080");
});