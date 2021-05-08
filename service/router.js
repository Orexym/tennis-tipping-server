const router = require('express').Router();
const middleware = require('./token-check');


// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.get('/authuseronly', loggedIn, userController.authuseronly);
/*router.get('/events', middleware.tokenCheck, function (req, res, next) {
  console.log('Requested events');
});*/

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Do not send');
})
// define the about route
router.get('/events', middleware.tokenCheck, function (req, res) {
  res.send('Requested events');
})


let sockets = [];
const socket = function (socket) {
  console.log("Connect");
  sockets.push(socket);
  
  // When you receive a message, send that message to every socket.
  socket.on('message', async function (msg) {
    console.log("Message", msg);
    await new Promise(resolve => setTimeout(resolve, 5000));
    sockets.forEach(s => s.send("Really? " + msg));
  });
  
  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function () {
    console.log("Close");
    sockets = sockets.filter(s => s !== socket);
  });
}

module.exports = { router, socket };