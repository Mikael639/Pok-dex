var pokemons= {
    props:["pokemons"],
    data: function(){
        return{
           page:1        
        }
        
    },
    template:
    `
    <v-row class="blue-grey lighten-5">
        <v-col class="col-12">
            <v-container fluid class="ma-0 pa-0 d-flex flex-wrap justify-center">
                <v-card class=" col-xl-2 col-lg-3 col-md-5 col-sm-10 col-xs-10 ma-2 pa-0" v-for="nompokemons in pokemons" :key="nompokemons.id">
                        <!-------------------------------------   V-card-Tittle ----------------------------------------------------->
                        <v-card-title :class="nompokemons.types[0].couleur">
                            <v-row class="d-flex flex-row">
                                <v-col>
                                    <v-chip color="black" text-color="white">
                                        {{nompokemons.id}}
                                    </v-chip>
                                </v-col>
                                <v-col >
                                    <v-container>
                                        {{nompokemons.nom}}
                                    </v-container>
                                </v-col>
                            </v-row>
                        </v-card-title>

                        <!------------------------------------- V-card-text ------------------------------------------------------->
                        <v-card-text>
                            <v-row>
                                <v-col class="col-6  flex-column">
                                    <v-img width="150" height="150" :src="'../images/'+nompokemons.image"></v-img>
                                    
                                    <v-container  v-for="nomtypes in nompokemons.types" :key="nomtypes.nom">
                                        <v-chip  :class="nomtypes.couleur">
                                            {{nomtypes.nom}}
                                        </v-chip>
                                    </v-container>
                                </v-col>
                                <v-col class="col-6 d-flex flex-column">
                                    <v-container>
                                        {{nompokemons.description}} 
                                    </v-container>
                                    <v-simple-table>
                                    <template v-slot:default>
                                            <tbody>
                                                <tr>
                                                    <td>HP</td>
                                                    <td>{{nompokemons.base.HP}}</td>  
                                                </tr>
                                                <tr>
                                                    <td>Attack</td>
                                                    <td>{{nompokemons.base.Attack}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Defense</td>
                                                    <td>{{nompokemons.base.Defense}}</td>
                                                </tr>
                                                <tr>
                                                    <td>SpAttack</td>
                                                    <td>{{nompokemons.base.SpAttack}}</td>
                                                </tr>
                                                <tr>
                                                    <td>SpDefense</td>
                                                    <td>{{nompokemons.base.SpDefense}}</td>
                                                </tr>
                                                <tr>
                                                    <td>Speed</td>
                                                    <td>{{nompokemons.base.Speed}}</td>
                                                </tr>
                                            </tbody>
                                            </template>
                                        </v-simple-table>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
            </v-container>
        </v-col>

    </v-row>
    `
};