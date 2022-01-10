import { Router } from 'express';
import { bearerTokenCheck } from './token-check.js';
import { login } from './auth.js';

export const router = Router();

/*********** Important routes ************/
router.get('/getCSRFToken', (req, res) => {
  res.json({ CSRFToken: req.CSRFToken() });
});
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

/********** Application routes ***********/
// define the home page route
router.get('/', function (req, res) {
  res.send('Do not send');
});
// define the events route
router.get('/events', bearerTokenCheck, function (req, res) {
  res.send('Requested events');
});

router.post('/login', login);


let sockets = [];
export const socket = function (soc) {
  console.log("Connect");
  sockets.push(soc);
  
  // When you receive a message, send that message to every socket.
  soc.on('message', async function (msg) {
    console.log("Message", msg);
    await new Promise(resolve => setTimeout(resolve, 5000));
    sockets.forEach(s => s.send("Really? " + msg));
  });
  
  // When a socket closes, or disconnects, remove it from the array.
  soc.on('close', function () {
    console.log("Close");
    sockets = sockets.filter(s => s !== soc);
  });
}