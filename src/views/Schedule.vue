<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>   
          <v-flex xs2></v-flex>
          <v-flex xs9>
            <v-data-table
              :headers="headers"
              :items="schedule"
              item-key="code"
              sort-by="code"
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Schedule</v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="700px">
                    <template v-slot:activator="{ on }">
                      <v-btn color="primary" dark class="mb-2" v-on="on">New Game</v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container grid-list-md>
                          <v-layout wrap>
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.gameDate" label="Game Date"></v-text-field>
                            </v-flex> 
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.home" label="Home Team"></v-text-field>
                            </v-flex>  
                            <v-flex xs12 sm6 md4>
                              <v-text-field v-model="editedItem.away" label="Away Team"></v-text-field>
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
const API_URL = 'http://erp.inovenso.com:8084/nba/schedule';
export default {
    components:{
      LeftMenu
    },
    data () {
    return {
      dialog: false,
      schedule:[],
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
        { text: 'Game Date',align: 'left',sortable: true, value: 'gameDate'}, 
        { text: 'Home Team', value: 'home'},        
        { text: 'Away Team',  value: 'away'  },          
      ]
    },    
    formTitle () {
      return this.editedIndex === -1 ? 'New Team' : 'Edit Team'
    },
  },
  created() {    
    this.getSchedule();  
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.schedule.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.schedule.indexOf(item)
      if(confirm('Are you sure you want to delete this item?')){
        this.schedule.splice(index, 1);
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
      this.getSchedule();
      this.close()
    },
    addTeam(item){
      this.$axios.post(API_URL, {
        code: item.code,
        name: item.name,       
      })
      .then(response => {        
        if (response.status === 201) {
          this.schedule.push(this.editedItem)
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
          Object.assign(this.schedule[this.editedIndex], this.editedItem)
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
    getSchedule(){     
        this.$axios.get(API_URL)
            .then(response => {
                this.schedule = response.data
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
