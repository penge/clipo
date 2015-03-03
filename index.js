'use strict';

/* SETUP */

var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var crypto       = require('crypto');
var config       = require('./config.json');

var app          = express();
var http         = require('http').Server(app);
var io           = require('socket.io')(http);

app.set('views', './views');
app.set('view engine', 'jade');
app.set('port', (process.env.PORT || 5000));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/* DB */

var db = require('./models');


/* APP */

app.get('/', function(req, res) {
  res.render('index', { app: config.app, host: req.headers.host });
});

app.post('/pages', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var passwordHash = createPasswordHash(password);

  db.Page.create({name: name, password: passwordHash}).then(function(newPage) {
    res.status(200).json({ id: newPage.id, name: newPage.name });
  }).catch(function() {
    res.status(409).end();
  });
});

app.post('/pages/access', function(req, res) {
  var name = req.body.name;
  var password = req.body.password;
  var passwordHash = createPasswordHash(password);

  res.cookie(name, passwordHash);
  res.status(200).end();
});

app.get('/:name([a-z0-9_\-]+)', function(req, res) {
  var name = req.params.name;

  db.Page.findOne({
    where: {
      name: name,
    },
    include: [
      db.Note
    ],
    order: [
      [ db.Note, 'createdAt', 'DESC' ]
    ]
  }).then(function(page) {
    if (page) {
      if (!isCookieValid(req, page)) {
        res.render('page-access', {name: name, id: page.id});
        return;
      }
      res.render('page', {page: page});
    } else {
      res.render('page-create', {name: name});
    }
  });
});

app.post('/notes', function(req, res) {
  var pageId = req.body.pageId;
  var text = req.body.text;

  db.Page.find(pageId).success(function(page) {
    if (!isCookieValid(req, page)) {
      res.status(403).end();
      return;
    }

    var note = db.Note.build({ text: text });

    page.addNote(note).then(function(newNote) {
      res.status(200).render('note', { note: newNote });
      console.log('IO --> page: ' + page.name + ' --> creating note: ' + note.id);
      io.to(page.name).emit('createNote', newNote.id, newNote.text);
    });
  });
});

app.post('/notes/:id', function(req, res) {
  var noteId = req.params.id;
  var text = req.body.text;

  db.Note.update({text: text}, {where: {id: noteId}}).success(function() {
    res.status(200).end();
    
    db.Note.find(noteId).then(function(note) {
      db.Page.find(note.PageId).then(function(page) {
        console.log('IO --> page: ' + page.name + ' --> updating note: ' + note.id);
        io.to(page.name).emit('updateNote', note.id, note.text);
      });
    });
  });
});

app.delete('/notes/:id', function(req, res) {
  var noteId = req.params.id;

  db.Note.find(noteId).success(function(note) {
    note.destroy().success(function() {
      res.status(200).end();
      db.Page.find(note.PageId).then(function(page) {
        console.log('IO --> page: ' + page.name + ' --> deleting note: ' + note.id);
        io.to(page.name).emit('deleteNote', note.id);
      });
    });
  }).catch(function() {
    res.status(409).end();
  });
});

var createPasswordHash = function(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
};

var isCookieValid = function(req, page) {
  var cookie = req.cookies[page.name];
  return cookie == page.password;
};

io.on('connection', function(socket){
  socket.on('joinPage', function(name) {
    if (!name) {
      return;
    }
    socket.join(name);
    console.log('IO --> joining --> page: ' + name);
  });
});

http.listen(app.get('port'), function() {
  console.log('listening on *:' + app.get('port'));
});