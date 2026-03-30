import fs from 'fs';
import express from 'express';
import serve_static from 'serve-static';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Base de données
const database = JSON.parse(fs.readFileSync(path.join(__dirname, 'pokedex.json')));

app.use(serve_static(path.join(__dirname, "public")));
app.use(morgan('dev'));

// Liste des Types de pokemons
app.get('/types', function(req,res) {
    res.send(database.types);
    console.log('Types envoyer');
})

// Liste des pokémons
app.get('/pokemons', function(req,res) {
    if (database && database.pokemons) {
      console.log(`Envoi de ${database.pokemons.length} pokemons`);
      res.send(database.pokemons);
    } else {
      console.error('Erreur: database.pokemons est absent');
      res.status(500).send({ error: 'Data missing' });
    }
})

// Liste des pokémons en fonction du type
app.get('/pokemons/:types', function(req,res) {
    if('types' in req.params){
        var types = req.params.types;
        var tableau = [];

        for(let i=0;i<database.pokemons.length;i++){
            for(let g=0;g<database.pokemons[i].types.length;g++){
                if(database.pokemons[i].types[g].nom == types){
                    tableau.push(database.pokemons[i]); 
                }
            }
        }
        res.send(tableau);
        console.log('Types Pokemons '+ req.params.types +' Envoyer');
    }
})

// Jouer la chanson Pokémon
app.get('/play', function(req, res) {
  var file = path.join(__dirname, 'public', 'pokemon.mp3');
  res.sendFile(file);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}`);
});