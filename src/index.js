import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';
import router from './routers/index.js';
import { fileURLToPath } from 'url';
import { createClient } from 'redis';
import path from 'path';

const redisUrl = 'redis://default:sfsoVvdeRpJjCL1czso4pC4inIvgyBxi@redis-12705.c274.us-east-1-3.ec2.cloud.redislabs.com:12705';

const client = createClient({
  password: 'sfsoVvdeRpJjCL1czso4pC4inIvgyBxi',
  socket: {
      host: 'redis-12705.c274.us-east-1-3.ec2.cloud.redislabs.com',
      port: 12705
  }
});

client.on('connect', () => console.log('Conectado a Redis Cloud exitosamente'));
client.on('error', (err) => console.log('Error al conectar a Redis:', err));

async function connectRedis() {
  await client.connect();
}

connectRedis();

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// Set the view engine to ejs
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the views path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
app.use(router);

// Iniciando el servidor
app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});

app.set('view engine', 'ejs');