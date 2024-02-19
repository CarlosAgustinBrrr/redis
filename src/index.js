import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import router from './routers/index.js';
import { fileURLToPath } from 'url';
import conectarDB from './config/database.js';
import { createClient } from 'redis';

async function testRedis() {
    const client = createClient();
    
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    try {
        console.log('Attempting to fetch from Redis');
        const result = await client.get('personas');
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.disconnect();
    }
}

testRedis();
const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Set the view engine to ejs
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..'); // Adjust the path as needed

// Set the views path
app.set('views', join(__dirname, 'views'));

conectarDB();

// Routes
app.use(router);

// Iniciando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});

app.set('view engine', 'ejs');