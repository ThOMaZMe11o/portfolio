const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',      
    user: 'root',
    password: 'fatec',
    database: 'meubanco'
});

db.connect((err) => {
    if (err) {
        console.error('🔴 Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('🟢 Conectado ao banco de dados MySQL');
});

// Create
app.post('/projetos', (req, res) => {
    const { nome, descricao } = req.body;
    const sql = 'INSERT INTO projetos (nome, descricao) VALUES (?, ?)';

    db.query(sql, [nome, descricao], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ 
            id: result.insertId, 
            nome, 
            descricao 
        });
    });
});

// READ para todos
app.get('/projetos', (req, res) => {
    db.query('SELECT * FROM projetos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Read por ID
app.get('/projetos/:id', (req, res) => {
    db.query('SELECT * FROM projetos WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send({ 
            mensagem: '❌ Projeto não encontrado' 
        });
        res.send(result[0]);
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { 
        nome: 'Seu Nome', 
        descricao: 'Descrição breve sobre você',
    });
});

app.get('/projetos', (req, res) => {
    res.render('projetos', { 
        projetos: [
            { nome: 'Projeto 1', descricao: 'Descrição do projeto 1' },
            { nome: 'Projeto 2', descricao: 'Descrição do projeto 2' },
        ],
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
