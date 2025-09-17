const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const store = new MemoryStore({ checkPeriod: 86400000 }); // prune expired entries every 24h
const app = express();

app.use(
  session({
    secret: 'locknload',
    cookie: {
      maxAge: 60000,
      secure: false, // should be true
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      sameSite: 'Lax', // should be Strict
      name: '__Host-session', // Ensures the cookie is only sent to the host that set it
    },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

const users = [
  { name: 'John', age: 22 },
  { name: 'Jane', age: 25 },
  { name: 'Jack', age: 30 },
];

const posts = [
  { title: 'Post 1', content: 'This is post 1' },
  { title: 'Post 2', content: 'This is post 2' },
];

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

app.get('/', (req, res) => {
  res.send({
    msg: 'Hello!',
    user: req.session.user || {},
  });
});

app.get('/users', isAuthenticated, (req, res) => {
  res.send(users);
});

app.post('/users', isAuthenticated, (req, res) => {
  const user = req.body;
  users.push(user);
  res.send(users);
});

app.post('/posts', isAuthenticated, (req, res) => {
  const post = req.body;
  posts.push(post);
  res.send(posts);
});

app.post('/login', (req, res) => {
  console.log(req.sessionID);
  const { username, password } = req.body;
  if (username && password) {
    if (username === 'admin' && password === 'admin') {
      req.session.authenticated = true;
      req.session.user = { username };

      // Store the session ID under the username
      store.get(username, (err, userSessions) => {
        if (err) {
          console.error(err);
        } else {
          if (!userSessions) {
            userSessions = [];
          }
          userSessions.push(req.sessionID);
          store.set(username, userSessions, err => {
            if (err) {
              console.error(err);
            }
          });
        }
      });

      res.json(req.session);
    } else {
      res.status(401).send({ msg: 'Invalid credentials' });
    }
  } else {
    res.status(400).send({ msg: 'Invalid request' });
  }
});

app.post('/logoutAll', isAuthenticated, (req, res) => {
  const username = req.session.user.username;

  store.get(username, (err, userSessions) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: 'Internal server error' });
    } else {
      if (userSessions) {
        userSessions.forEach(sessionID => {
          store.destroy(sessionID, err => {
            if (err) {
              console.error(err);
            }
          });
        });
        store.set(username, [], err => {
          if (err) {
            console.error(err);
          }
        });
      }
      res.send({ msg: 'Logged out from all devices' });
    }
  });
});

// Route to get all active sessions for a user
app.get('/sessions', isAuthenticated, (req, res) => {
  const username = req.session.user.username;

  store.get(username, (err, userSessions) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: 'Internal server error' });
    } else {
      res.send({ sessions: userSessions || [] });
    }
  });
});

// Route to kill a specific session for a user
app.post('/killSession', isAuthenticated, (req, res) => {
  const username = req.session.user.username;
  const { sessionID } = req.body;

  if (!sessionID) {
    return res.status(400).send({ msg: 'Session ID is required' });
  }

  store.get(username, (err, userSessions) => {
    if (err) {
      console.error(err);
      res.status(500).send({ msg: 'Internal server error' });
    } else {
      if (userSessions && userSessions.includes(sessionID)) {
        store.destroy(sessionID, err => {
          if (err) {
            console.error(err);
            res.status(500).send({ msg: 'Failed to destroy session' });
          } else {
            const updatedSessions = userSessions.filter(id => id !== sessionID);
            store.set(username, updatedSessions, err => {
              if (err) {
                console.error(err);
                res.status(500).send({ msg: 'Failed to update sessions' });
              } else {
                res.send({ msg: 'Session terminated' });
              }
            });
          }
        });
      } else {
        res.status(404).send({ msg: 'Session not found' });
      }
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
