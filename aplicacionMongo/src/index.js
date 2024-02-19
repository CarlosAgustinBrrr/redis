const express = require('express');
const router = require ('./routes/index.js');
const path = require('path');
const app = express();

//Configuraciones
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', router);
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);
app.use(express.json());

//Iniciando el servidor, escuchando...
app.listen(app.get('port'),()=>{
    console.log(`Server listening on port ${app.get('port')}`);
});

