var fs = require('fs');
var express = require('express');
var app = express();
var serve_static = require('serve-static');
const path = require('path');
var morgan = require('morgan');


//Base de données
var database = JSON.parse(fs.readFileSync('pokedex.json'));

app.use(serve_static(__dirname+"/public"));

app.use(morgan('dev'));


// Liste des Types de pokemons
app.get('/types', function(req,res) {
    res.send(database.types);
    console.log('Types envoyer');
})

// Liste des pokémons
app.get('/pokemons', function(req,res){
    res.send(database.pokemons);
    console.log('Pokemons envoyer');
})

//Liste des pokémons en fonction du type
app.get('/pokemons/:types',function(req,res)
{
    if('types' in req.params){
        var types = req.params.types;
        var tableau = [];

        for(let i=0;i<database.pokemons.length;i++){
            for(let g=0;g<database.pokemons[i].types.length;g++){
                if(database.pokemons[i].types[g].nom ==types){
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
  var file = path.join(__dirname, 'public', 'Pokémon.mp3');
  res.sendFile(file);
});

app.listen(8080);