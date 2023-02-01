const express = require('express');
const path = require('path');
const fs = require('fs');
const noteData = require('./db/db.json')
const uuid = require('./helpers/uuid');

const PORT = 3001;

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

app.get('/api/notes', (req, res) => res.json(noteData));

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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
