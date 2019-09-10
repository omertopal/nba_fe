<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>   
          <v-flex xs2></v-flex>
          <v-flex xs9>
            <v-data-table
              :headers="headers"
              :items="teams"
              item-key="code"
              sort-by="code"
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
      ]
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
