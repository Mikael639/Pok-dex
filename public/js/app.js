new Vue ({
    el:'#app',
    vuetify: new Vuetify(),
    data:{
        types:[],
        pokemons:[],
        typespokemons:[],
        pokemonsAffiches:[],
        page:1,
        Format_mobile:false,
        recherche_nom :[],
        selectedType: null,
        searchQuery:'',
        isPlaying: false,
        audio:null
    },
    components:{
        //Appel du composant pokemons dans composants.js
       'pokemons':pokemons,
    },
    created:function(){
        this.getTypes();
        this.getPokemons();
        this.getTypesPokemons();
        this.onResize();
        this.mounted();
       
    },
    methods:
    {
        getTypes:function(){
            var self = this;
            axios.get("types/").then(function(response){
                self.types = response.data;
            })
        },
        getPokemons:function(){
            let self = this;
            
            axios.get("pokemons/").then(function(response){
                for(var i=0;i<response.data.length;i++){
                self.pokemons.push(response.data[i]);
                self.recherche_nom.push(response.data[i].nom);
                }
               self.majPage();
            })
        },
        filterPokemons: function() {
            var self = this;
            axios.get("/pokemons/" + self.selectedType).then(function(response) {
            self.pokemonsAffiches = response.data;
             });
            },
        getTypesPokemons:function(){
            let self = this;
            axios.get("types/").then(function(response){
                var types = response.data;
                for (let i=0;i<response.data.length;i++){
                    self.typespokemons.push(response.data[i]["nom"]);
            }
        })   
        //    console.log(self.typespokemons)
        },
        searchPokemon: function() {
            console.log("Recherche Pokémons");
            var query = this.searchQuery.toLowerCase().trim();
            if (query === '') {
                this.pokemonsAffiches = this.pokemons;
            }    
            else {
                this.pokemonsAffiches = this.pokemons.filter(function(pokemon) {
                return pokemon.nom.toLowerCase().includes(query);
                });
            }   
            
        },
        onResize:function()
        {
            var largeur = window.innerWidth;
            if(largeur<600){
                this.Format_mobile= true;
            }else{
                this.Format_mobile = false;
            }
        },
        mounted:function()
        {
            this.onResize();
            window.addEventListener('resize',this.onResize,{passive:true});
        },
        beforeDestroy:function()
        {
            if(typeof window==='undefined') return;
            window.removeEventListener('resize',this.onResize,{passive:true});
        },
        majPage:function(){                
            let self = this;                 
            self.onResize();                                  
            page_min =(self.page-1)*9;                 
            page_max= page_min + 8;
            self.pokemonsAffiches=[];
            if(page_max>self.pokemons.length-1){                    
            page_max=self.pokemons.length-1;
            }                
            for(let i=page_min;i <= page_max;i++){                     
            self.pokemonsAffiches.push(self.pokemons[i]);              
            }       
        },

        playPokemonSong: function() {
            if (!this.isPlaying) {
            this.audio = new Audio('/play');
            this.audio.play();
            this.isPlaying = true;
            }
        },

        stopPokemonSong: function() {
            if (this.isPlaying && this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            }
        }
    }
   
}
);