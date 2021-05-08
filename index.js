const app = require('express')();
const cors = require('cors');
const ws = require('ws');
const handler = require('./service/router');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const serverPort = 3001;
const corsOptions = {
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200
}

// HTTP endpoint
app.use(cors(corsOptions));
app.get('*', handler.router);

// WS endpoint
const wsServer = new ws.Server({noServer: true}).on('connection', handler.socket);

// Start
const server = app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});


