<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>   
          <v-flex xs2></v-flex>
          <v-flex xs9>
            <v-data-table
              :headers="headers"
              :items="teamsComputed"
              :items-per-page="30"
              item-key="code"
              sort-by="gameDays._1_5"
              :sort-desc=true
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Teams</v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="700px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">New Team</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm6 md3>
                              <v-text-field v-model="editedItem.code" label="Team Code"></v-text-field>
                            </v-flex> 
                            <v-flex xs12 sm6 md9>
                              <v-text-field v-model="editedItem.name" label="Team Name"></v-text-field>
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
const API_URL = 'http://erp.inovenso.com:8084/nba/teams';
export default {
    components:{
      LeftMenu
    },
    data () {
    return {
      dialog: false,
      teams:[],
      search: '',
      editedIndex: -1,
      editedItem: {
        code: '',
        name: '',
      },
      defaultItem: {
        code: '',
        name: '',
      },
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Team Code',align: 'left',sortable: true, value: 'code'},        
        { text: 'Team Name',  value: 'name'  },
        { text: 'ALL',  value: 'gameDays.ALL'  },
        { text: '1-3',  value: 'gameDays._1_3'  },
        { text: '1-4',  value: 'gameDays._1_4'  },
        { text: '1-5',  value: 'gameDays._1_5'  },
        { text: '1-6',  value: 'gameDays._1_6'  },
        { text: 'G1',  value: 'gameDays._1_GAME'  },          
        { text: 'G2',  value: 'gameDays._2_GAME'  },
        { text: 'G3',  value: 'gameDays._3_GAME'  },
        { text: 'G4',  value: 'gameDays._4_GAME'  }, 
        { text: 'G5',  value: 'gameDays._5_GAME'  },          
        { text: 'G6',  value: 'gameDays._6_GAME'  },
        { text: 'G7',  value: 'gameDays._7_GAME'  },
        { text: 'G8',  value: 'gameDays._8_GAME'  }, 
        { text: 'G9',  value: 'gameDays._9_GAME'  },    

      ]
    }, 
    teamsComputed(){
      return this.teams.map((item) => { 
        item.gameDays._1_3 = 0;  
        item.gameDays._1_4 = 0;
        item.gameDays._1_5 = 0;
        item.gameDays._1_6 = 0;
        item.gameDays.ALL = 0;
        if(item.gameDays._1_GAME>0){
          item.gameDays._1_3 += item.gameDays._1_GAME;
        } 
        if(item.gameDays._2_GAME>0){
          item.gameDays._1_3 += item.gameDays._2_GAME;
        } 
        if(item.gameDays._3_GAME>0){
          item.gameDays._1_3 += item.gameDays._3_GAME;
        }
        item.gameDays._1_4 = item.gameDays._1_3;
        if(item.gameDays._4_GAME>0){
          item.gameDays._1_4 += item.gameDays._4_GAME;
        }

        item.gameDays.ALL = item.gameDays._1_4;
        item.gameDays._1_5 = item.gameDays._1_4;
        if(item.gameDays._5_GAME>0){
          item.gameDays._1_5 += item.gameDays._5_GAME;
          item.gameDays.ALL += item.gameDays._5_GAME;
        }  

        if(item.gameDays._6_GAME>0){
          item.gameDays._1_6 += item.gameDays._1_4 + item.gameDays._5_GAME + item.gameDays._6_GAME;
          item.gameDays.ALL += item.gameDays._6_GAME;
        } 
        if(item.gameDays._7_GAME>0){
          item.gameDays.ALL += item.gameDays._7_GAME;          
        } 
        if(item.gameDays._8_GAME>0){
          item.gameDays.ALL += item.gameDays._8_GAME;          
        } 
        if(item.gameDays._9_GAME>0){
          item.gameDays.ALL += item.gameDays._9_GAME;        
        } 
        if(item.gameDays._10_GAME>0){
          item.gameDays.ALL += item.gameDays._10_GAME;           
        } 
        if(item.gameDays._11_GAME>0){
          item.gameDays.ALL += item.gameDays._11_GAME;           
        } 
        if(item.gameDays._12_GAME>0){
          item.gameDays.ALL += item.gameDays._12_GAME;           
        }
        if(item.gameDays._13_GAME>0){
          item.gameDays.ALL += item.gameDays._13_GAME;           
        }
        if(item.gameDays._14_GAME>0){
          item.gameDays.ALL += item.gameDays._14_GAME;           
        }
        if(item.gameDays._15_GAME>0){
          item.gameDays.ALL += item.gameDays._15_GAME;           
        }    
        return item;    
      })
    },   
    formTitle () {
      return this.editedIndex === -1 ? 'New Team' : 'Edit Team'
    },
  },
  created() {    
    this.getTeams();  
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.teams.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.teams.indexOf(item)
      if(confirm('Are you sure you want to delete this item?')){
        this.teams.splice(index, 1);
        this.deleteTeam(item);
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
        this.updateTeam(this.editedItem);
      } else {
        this.addTeam(this.editedItem);         
      }
      this.getTeams();
      this.close()
    },
    addTeam(item){
      this.$axios.post(API_URL, {
        code: item.code,
        name: item.name,       
      })
      .then(response => {        
        if (response.status === 201) {
          this.teams.push(this.editedItem)
        } 
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    updateTeam(item){
      this.$axios.put(API_URL, {
        code: item.code,
        name: item.name,       
      })
      .then(response => {
        if (response.status === 200) {
          Object.assign(this.teams[this.editedIndex], this.editedItem)
        }         
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    deleteTeam(item){
      this.$axios.delete(API_URL+'/'+item.code)
      .then(response => {
      }) 
      .catch(error => {
        console.log(error);
      }); 
    },
    getTeams(){     
        this.$axios.get(API_URL)
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
