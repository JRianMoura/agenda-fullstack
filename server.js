//padrão de projeto MVC 

// proteção do meu ambiente de desenvolvimento
require('dotenv').config();

const { log } = require('console');

// inciciando o express
const express = require('express');
const app = express();

// modelador da base de dados
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    app.emit("pronto");
}).catch( e => console.log(e));

// salvar cookie no computador do cliente
const session = require('express-session');

// falar que sessoes serao salvas dentro da base de dados
const MongoStore = require('connect-mongo');

// Mensagem que somem da base de dados quando são lidas 
const flash = require('connect-flash');

// são as rotas da aplicação /home, /contatos
const routes = require('./routes');

// trabalhar com caminhos "__dirname"
const path = require('path');

// proteção recomendada pelo próprio express 
const helmet = require('helmet');

// criação de token para os formulário, para impedir que sites externos postem requisições dentro da aplicação 
const csrf = require('csurf');

//middlewares são funções executadas dentro da rota, no caso para "interceptar" antes ou depois de responder o cliente
const { middlewareGlobal, csrfError, csrfMiddleware }  = require('./src/middlewares/middleware')

// proteção sugerida pelo express
app.use(helmet());

// podemos postar formulario e json para dentro da aplicação
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// arquivos estáticos que são acessados diretamente
app.use(express.static(path.resolve(__dirname, 'public')));

// configuração de sessão
const sessionOptions = session({
    secret: 'abcdefghijklmn()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // semana
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

// arquivos que são renderizados na tela que geralmente são html
app.set('views', path.resolve(__dirname, 'src', 'views'));

// engine usada para renderizar o html (ejs)
app.set('view engine', 'ejs');

// proteção do servidor
app.use(csrf());

// meu proprio middleware
app.use(middlewareGlobal);
app.use(csrfError);
app.use(csrfMiddleware);

// chamando as rotas
app.use(routes);

// depois de receber o sinal do mongoose que conctou a base de dados o servidor poder ouvir requisições
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
    });
});