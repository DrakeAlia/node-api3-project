const express = require('express');

const Users = require('./userDb.js');

const Posts = require("../posts/postDb.js");

const router = express.Router();


router.post('/', validateUser("name"), (req, res) => {
  // do your magic!
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: "Issue with saving user to the database"});
  })
});

router.post('/:id/posts', validatePost("text"), (req, res) => {
  // do your magic!
  const user = {...req.body, user_id: req.params.id};
  Posts.insert(user)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: "Issue with saving user to the database"});
  })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({ error: "The users information could not be retrieved."});
  });
});


router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
         res.status(200).json(user);
      })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ error: "The user information could not be retrieved."});
    }); 
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
  .then(posts => {
   res.status(200).json(posts);
    })
  .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({ error: "The posts could not be retrieved."});
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
  .then(user => {
    res.status(200).json(user);
  })
  Users.remove(req.params.id)
  .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({ error: "The user could not be removed"});
  });
});

router.put('/:id', validateUser("name"), validateUserId, (req, res) => {
  // do your magic!
  Users.update(req.params.id, req.body)
  .then(user => {
      res.status(200).json(user);
    })
 .catch(error => {
    // log error to database
    console.log(error);
    res.status(500).json({ error: "The user information could not be modified."});
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "user id is invaild"});
      } else {
         req.user = user;
         next();
      }
    })
}

function validateUser(props) {
  // do your magic!
  return function (req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: `data for ${props} is missing`})
  } else if (!req.body[props]) {
    res.status(400).json({ message: `${props} field is required`})
  } else if (req.body) {
    return next()
    }
  }
}

function validatePost(props) {
  // do your magic!
  return function (req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: `data for ${props} is missing`})
  } else if (!req.body[props]) {
    res.status(400).json({ message: `${props} field is required`})
  } else if (req.body) {
    return next()
  }
  }
}

module.exports = router;
