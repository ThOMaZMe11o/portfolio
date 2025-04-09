const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

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
