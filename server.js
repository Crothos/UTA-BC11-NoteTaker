const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const port = process.env.PORT || 3001

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  var options = { encoding: 'utf8', flag: 'r' };
  res.json(JSON.parse(fs.readFileSync('./db/db.json', options)));
});

app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {

    const newNote = {
      title,
      text,
      id: uuid(),
    };


    fs.readFile('./db/db.json', 'utf8', (err, noteData) => {
      if (err) {
        console.error(err);
      } else {

        const parsedNotes = JSON.parse(noteData);
        console.log(parsedNotes);
        parsedNotes.push(newNote);

        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, noteData) => {
    if (err) {
      console.error(err);
    } else {
      var parsedNotes = JSON.parse(noteData);
      parsedNotes = parsedNotes.filter(item => item.id !== req.params.id);

      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated notes!')
      );
    }
  });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port} ????`)
);
