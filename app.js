const express = require('express');
const app = express();
const path = require('path');
// Ponto Crítico 1: Certifique-se de que está importando 'mysql2/promise'
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// Ponto Crítico 2: Verifique se estas credenciais estão corretas
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'fatec',
    database: 'meubanco',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- ROTAS DA API (CRUD) ---

app.get('/projetos', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM projetos');
        res.send(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/projetos/:id', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id]);
        if (result.length === 0) {
            return res.status(404).send({ mensagem: 'Projeto não encontrado' });
        }
        res.send(result[0]);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/projetos', async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        const [result] = await db.query('INSERT INTO projetos (nome, descricao) VALUES (?, ?)', [nome, descricao]);
        res.status(201).send({ id: result.insertId, nome, descricao });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/projetos/:id', async (req, res) => {
    try {
        const { nome, descricao } = req.body;
        await db.query('UPDATE projetos SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, req.params.id]);
        res.send({ mensagem: 'Projeto atualizado com sucesso' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/projetos/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM projetos WHERE id = ?', [req.params.id]);
        res.send({ mensagem: 'Projeto removido com sucesso' });
    } catch (err) {
        res.status(500).send(err);
    }
});


// --- ROTAS DAS PÁGINAS ---

// Ponto Crítico 3: Esta rota é a que renderiza sua página e agora é a prova de falhas.
app.get('/', async (req, res) => {
    try {
        // As duas consultas são feitas antes de qualquer tentativa de renderizar a página
        const [homeResult] = await db.query('SELECT * FROM home LIMIT 1');
        const [projetosResult] = await db.query('SELECT * FROM projetos');

        // Valores padrão são definidos caso as tabelas estejam vazias
        const home = homeResult[0] || { titulo: 'Portfólio', subtitulo: 'Sem descrição cadastrada' };

        // A renderização SÓ acontece aqui, com a garantia de que 'projetos' sempre existirá.
        res.render('index', {
            nome: home.titulo,
            descricao: home.subtitulo,
            projetos: projetosResult || [] // Garante que projetos seja no mínimo um array vazio
        });

    } catch (err) {
        // Se qualquer uma das consultas falhar, este bloco é executado.
        console.error("🔴 Erro grave ao buscar dados para a página inicial:", err);
        res.status(500).send("Não foi possível carregar a página. Verifique o console do servidor.");
    }
});

app.get('/projetos-view', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM projetos');
        res.render('projetos', { projetos: results });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Inicialização do servidor
app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});