const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

let produtos = [
    { 
        id: 1, 
        nome: "Arroz 5kg", 
        preco: 25.00, 
        imagem: "https://www.minhareceita.com.br/app/uploads/2025/05/R0525-arroz-japones-650x355-1.webp" 
    },
    { 
        id: 2, 
        nome: "Feijão 1kg", 
        preco: 7.00, 
        imagem: "https://rrmedicos.com.br/wp-content/uploads/2023/07/feijao-enriquecido-saudavel-receita-rr-medicos-1.jpg" 
    },
    {
        id: 3, 
        nome: "Óleo de Soja", 
        preco: 8.50, 
        imagem: "https://blog.onduleze.com.br/wp-content/uploads/2024/02/1-16.jpg" 
    },
    { 
        id: 4, 
        nome: "Açúcar 5kg", 
        preco: 19.90, 
        imagem: "https://drdanielstellin.com.br/wp-content/uploads/2018/05/acucar.jpg" 
    },
    { 
        id: 5, 
        nome: "Leite Integral", 
        preco: 5.50, 
        imagem: "https://s2-oglobo.glbimg.com/_86_pBxpzM4e40drYhNoCf2aCvA=/0x0:22945x10231/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2023/V/U/yjvs4DQ06ni0A8IA9vNg/fresh-milk-mug-jug-wooden-table-1-.jpg" 
    },
    { 
        id: 6, 
        nome: "Café 500g", 
        preco: 12.00, 
        imagem: "https://images.educamaisbrasil.com.br/content/noticias/dia-mundial-do-cafe-saiba-como-a-bebida-pode-melhorar-seus-estudos_g.jpg" 
    }
];

let ultimoId = produtos.length;
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
    ultimoId++; // aumenta o ID único
    const novo = { id: ultimoId, nome, preco, imagem };
    produtos.push(novo);
    res.status(201).json(novo);
  });

  app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = produtos.find(p => p.id === id);
    if (!produto) return res.status(404).json({ erro: "Produto não encontrado" });

    // Atualiza todos os campos se enviados
    if (req.body.nome) produto.nome = req.body.nome;
    if (req.body.preco) produto.preco = parseFloat(req.body.preco);
    if (req.body.imagem) produto.imagem = req.body.imagem;

    res.json(produto);
});

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tamanhoAntes = produtos.length;
    produtos = produtos.filter(p => p.id !== id);
  
    if (produtos.length === tamanhoAntes) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
  
    res.json({ mensagem: `Produto ${id} removido` });
  });

// Start do servidor
app.listen(8081, () => {
    console.log("Servidor iniciado na porta 8081: http://localhost:8081");
});