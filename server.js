const express = require('express');

const postRouter = require('./posts/postRouter.js');

const userRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());

// for posts
server.use('/api/posts', logger, postRouter)
// for users
server.use('/api/users', logger, userRouter)


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  // YYYY-MM-DD
  const today = new Date().toISOString(); 
    console.log(`[${today}] ${req.method} to ${req.originalUrl}`);

   next();
}
server.use(logger);

module.exports = server;
