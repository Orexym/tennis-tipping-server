import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import express from 'express';
import ws from "ws";
import { router, socket } from './service/router.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const serverPort = 3001;
const corsOptions = {
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200
};
const csrfProtection = csrf({
  cookie: true
});

// App configuration
app.use(cors(corsOptions));
app.use(csrfProtection);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.COOKIE_SECRET));

// HTTP endpoint
app.get('*', router);

// WS endpoint
const wsServer = new ws.Server({noServer: true}).on('connection', socket);

// Start
const server = app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
  
  
});
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});


