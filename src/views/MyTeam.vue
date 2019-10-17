<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>   
          <v-flex xs2></v-flex>
          <v-flex xs9>
            <v-data-table
              :headers="headers"
              :items="playersComputed"
              item-key="id"
              sort-by="product"
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>My Players</v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="700px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">New Player</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm6 md2>
                              <v-text-field v-model="editedItem.sira" label="Q-Rank"></v-text-field>
                            </v-flex> 
                            <v-flex xs12 sm6 md7>
                              <v-text-field v-model="editedItem.name" label="Player Name"></v-text-field>
                            </v-flex>                            
                            <v-flex xs12 sm6 md3>
                              <v-text-field v-model="editedItem.avgPts" label="Avarage Points"></v-text-field>
                            </v-flex>  
                            <v-flex xs12 sm6 md2>
                              <v-text-field v-model="editedItem.gamesPlayed" label="Games Played"></v-text-field>
                            </v-flex> 
                            <v-flex xs12 sm6 md10>
                              <v-combobox
                                :items="teams"
                                label="Select Team"
                                v-model="editedItem.team"
                                item-text="name"
                                single-line
                                return-object
                              ></v-combobox>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                              <v-row justify="space-around">
                                <v-checkbox v-model="editedItem.isPGBoolean" label="PG"></v-checkbox>
                                <v-checkbox v-model="editedItem.isSGBoolean" label="SG"></v-checkbox>
                                <v-checkbox v-model="editedItem.isSFBoolean" label="SF"></v-checkbox>
                                <v-checkbox v-model="editedItem.isPFBoolean" label="PF"></v-checkbox>
                                <v-checkbox v-model="editedItem.isCBoolean" label="C"></v-checkbox>
                              </v-row>
                            </v-flex>  
                            <v-flex xs12 sm6 md1></v-flex>
                            <v-flex xs12 sm6 md5>
                              <v-row justify="space-around">                                
                                <v-checkbox v-model="editedItem.isMyBoolean" label="On My Team"></v-checkbox>
                                <v-checkbox v-model="editedItem.isPotentialBoolean" label="Is Potential"></v-checkbox>
                              </v-row>
                            </v-flex>                                                                                                                                                                       
                          </v-layout>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" dark class="mb-2" @click="close">Cancel</v-btn>
                        <v-btn color="success" dark class="mb-2" @click="save">Save</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
                <v-text-field v-model="search" label="Search " class="mx-4"></v-text-field>
              </template> 
              <template v-slot:body.append>                    
              </template>             
              <template v-slot:item.action="{ item }">              
                <v-icon                  
                  @click="editItem(item)">
                  mdi-table-edit
                </v-icon>
                <v-icon                  
                  @click="deleteItem(item)"
                >
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs1></v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import LeftMenu from '../components/LeftMenu';
const PLAYERS_API_URL = 'http://erp.inovenso.com:8084/nba/players';
const API_URL = 'http://erp.inovenso.com:8084/nba/players/myPlayers';
const TEAMS_API_URL = 'http://erp.inovenso.com:8084/nba/teams';
export default {
    components:{
      LeftMenu
    },
    data () {
    return {
      dialog: false,
      teams:[],
      search: '',
      players: [],
      editedIndex: -1,
      editedItem: {
        model: '',
          category: '',
          explanation: '', 
      },
      defaultItem: {
        model: '',
          category: '',
          explanation: '', 
      },
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Q-Rank', align: 'center', value: 'sira'  },
        { text: 'Player Name',align: 'left',sortable: true, value: 'name'},        
        { text: 'Team',  value: 'team.name'  },   
        { text: 'Positions', align: 'center', value: 'playerPositions', sortable: false },     
        { text: 'Avarage Points', align: 'center', value: 'avgPts', sortable: false },        
        { text: 'Actions', value: 'action', sortable: false },
      ]
    },
    playersComputed(){
      return this.players.map((item) => {   
        item.playerPositions = '';
        item.isPGBoolean = false;
        item.isSGBoolean = false;
        item.isSFBoolean = false;
        item.isPFBoolean = false;
        item.isCBoolean = false;
        item.isMyBoolean = false;
        item.isPotentialBoolean = false;
        if(item.isMy>0){
          item.isMyBoolean = true;
        }
        if(item.isPotential>0){
          item.isPotentialBoolean = true;
        }        
        if(item.isPG>0){
          item.isPGBoolean = true;
          item.playerPositions = item.playerPositions+','+'PG';
        } 
        if(item.isSG>0){
          item.isSGBoolean = true;
          item.playerPositions = item.playerPositions+','+'SG';
        } 
        if(item.isSF>0){
          item.isSFBoolean = true;
          item.playerPositions = item.playerPositions+','+'SF';
        } 
        if(item.isPF>0){
          item.isPFBoolean = true;
          item.playerPositions = item.playerPositions+','+'PF';
        }
        if(item.isC>0){
          item.isCBoolean = true;
          item.playerPositions = item.playerPositions+','+'C';
        }           
        item.playerPositions = item.playerPositions.substr(1); 
        return item;    
      })
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Player' : 'Edit Player'
    },
  },
  created() {    
    this.getTeams();
    this.getPlayers();    
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.players.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.players.indexOf(item)
      if(confirm('Are you sure you want to delete this item?')){
        this.players.splice(index, 1);
        this.deletePlayer(item);
      } 
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {        
        this.updatePlayer(this.editedItem);
      } else {
        this.addPlayer(this.editedItem);         
      }
      this.getPlayers();
      this.close()
    },
    addPlayer(item){
      this.$axios.post(API_URL, {
        name: item.name,
        team : item.team.code,
        sira: item.sira,
        isPG: item.isPGBoolean ? 1 : 0,
        isSG: item.isSGBoolean ? 1 : 0,
        isSF: item.isSFBoolean ? 1 : 0,
        isPF: item.isPFBoolean ? 1 : 0,
        isC: item.isCBoolean ? 1 : 0,
        isMy: item.isMyBoolean ? 1 : 0,
        isPotential: item.isPotentialBoolean ? 1 : 0,
        gamesPlayed : item.gamesPlayed,
        avgPts: item.avgPts,
      })
      .then(response => {        
        if (response.status === 201) {
          this.players.push(this.editedItem)
        } 
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    updatePlayer(item){
      this.$axios.put(PLAYERS_API_URL, {
        id: item.id,
        name: item.name,
        team : item.team.code,
        sira: item.sira,
        isPG: item.isPGBoolean ? 1 : 0,
        isSG: item.isSGBoolean ? 1 : 0,
        isSF: item.isSFBoolean ? 1 : 0,
        isPF: item.isPFBoolean ? 1 : 0,
        isC: item.isCBoolean ? 1 : 0,
        isMy: item.isMyBoolean ? 1 : 0,
        isPotential: item.isPotentialBoolean ? 1 : 0,
        gamesPlayed : item.gamesPlayed,
        avgPts: item.avgPts,
      })
      .then(response => {
        if (response.status === 200) {
          this.getPlayers();
        }         
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    deletePlayer(item){
      this.$axios.delete(API_URL+'/'+item.id)
      .then(response => {
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    getPlayers(){     
        this.$axios.get(API_URL)
            .then(response => {
                this.players = response.data
            }) 
            .catch(error => {
                console.log(error);
            });                         
    },
    getTeams(){     
        this.$axios.get(TEAMS_API_URL)
            .then(response => {
                this.teams = response.data
            }) 
            .catch(error => {
                console.log(error);
            });                         
    }, 
    filterOnlyCapsText (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
    },
  },
}
</script>
