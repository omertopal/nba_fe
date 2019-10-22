<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>  
          <v-flex xs1/> 
          <v-flex xs6>
            <v-combobox
              :items="calculationsListText"
              label="Select Calculation Id"                    
              item-text="calculationText"
              single-line
              return-object
              v-on:change="calculationIdChanged"
            ></v-combobox>
          </v-flex> 
          <v-flex xs1/>   
          <v-flex xs2>
            <v-btn color="primary" dark class="mb-2" @click="calculate">Calculate</v-btn>
          </v-flex> 
          <v-flex xs2/>
          <v-flex xs1></v-flex>
          <v-flex xs10>
            <v-data-table
              :headers="playerHeaders"
              :items="playerBenefitList"
              item-key="player"
              sort-by="totalUsage"
              :sort-desc=true
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >             
              <template v-slot:body.append>                    
              </template>                          
            </v-data-table>
          </v-flex>
          <v-flex xs12>
            <v-divider class="mx-4"
                      inset
                      vertical>
            </v-divider>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs10>
            <v-data-table
              :headers="teamHeaders"
              :items="teamBenefitList"
              item-key="team"
              sort-by="utCount"
              :sort-desc=true
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >   
              <template v-slot:top>                                           
                <v-text-field v-model="search" label="Search " class="mx-4"></v-text-field>              
              </template>           
              <template v-slot:body.append>                    
              </template>                          
            </v-data-table>
          </v-flex>
          <v-flex xs12>
            <v-divider class="mx-4"
                      inset
                      vertical>
            </v-divider>
          </v-flex>
          <v-flex xs1></v-flex>
          <v-flex xs10>
            <v-data-table
              :headers="headers"
              :items="gameDateRostersComputed"
              item-key="gameDate"
              sort-by="gameDate"
              class="elevation-1"
              :search="search"
              :custom-filter="filterOnlyCapsText"
              >
              <template v-slot:top>                                           
                <v-text-field v-model="search" label="Search " class="mx-4"></v-text-field>              
              </template> 
              <template v-slot:body.append>                    
              </template>                          
            </v-data-table>
          </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import LeftMenu from '../components/LeftMenu';
const API_URL = 'http://erp.inovenso.com:8084/nba/calc';
export default {
    components:{
      LeftMenu
    },
    data () {
    return {
      calculationsList:[],
      teamBenefitList:[],
      gameDateRosters:[],
      playerBenefitList:[],
      search: '',     
    }
  },
  computed: {
    playerHeaders(){
      return [
        { text: 'Player Name',align: 'left',sortable: true, value: 'playerName'},  
        { text: 'Total Usage',align: 'left',sortable: true, value: 'totalUsage'},   
        { text: 'Must Have',align: 'left',sortable: true, value: 'mustHave'},                             
      ]
    },
    teamHeaders () {
      return [
        { text: 'Team',align: 'left',sortable: true, value: 'team'},  
        { text: 'Total Days',align: 'left',sortable: true, value: 'totalCount'},              
        { text: 'PG',  value: 'pgCount'  },      
        { text: 'SG',  value: 'sgCount'  },
        { text: 'SF',  value: 'sfCount'  },
        { text: 'PF',  value: 'pfCount'  },
        { text: 'C',  value: 'cCount'  },
        { text: 'UT',  value: 'utCount'  },
      ]
    }, 
    headers () {
      return [
        { text: 'Date',align: 'left',sortable: true, value: 'gameDate'},  
        { text: 'Total Points',align: 'left',sortable: true, value: 'totalPts'},              
        { text: 'PG',  value: 'pgPlayer'  },      
        { text: 'SG',  value: 'sgPlayer'  },
        { text: 'SF',  value: 'sfPlayer'  },
        { text: 'PF',  value: 'pfPlayer'  },
        { text: 'C',  value: 'cPlayer'  },
        { text: 'UT',  value: 'utPlayer'  },
      ]
    },   
    calculationsListText(){
      return this.calculationsList.map((item) => {           
        item.calculationText = '  CALC '+item.calcId+' - '+item.runTime;        
        return item;    
      })
    },        
    gameDateRostersComputed(){
      return this.gameDateRosters.map((item) => { 
        if(item.totalPts) {
          item.totalPts  = item.totalPts.toFixed(2);
        }           
        if(item.pgModel && item.pgModel.name ){
            item.pgPlayer = item.pgModel.name + ' (' +item.pgModel.avgPts + ')';
        } 
        if(item.sgModel!=null && item.sgModel.name ){
            item.sgPlayer = item.sgModel.name + ' (' +item.sgModel.avgPts + ')';
        } 
        if(item.sfModel!=null && item.sfModel.name ){
            item.sfPlayer = item.sfModel.name + ' (' +item.sfModel.avgPts + ')';
        }  
        if(item.pfModel!=null && item.pfModel.name ){
            item.pfPlayer = item.pfModel.name + ' (' +item.pfModel.avgPts + ')';
        } 
        if(item.cModel!=null && item.cModel.name ){
            item.cPlayer = item.cModel.name + ' (' +item.cModel.avgPts + ')';
        }
        if(item.utModel!=null && item.utModel.name ){
            item.utPlayer = item.utModel.name + ' (' +item.utModel.avgPts + ')';
        }          
        return item;    
      })
    }, 
    formTitle () {
      return 'Game Date Rosters'
    },
  },
  created() {    
    this.getCalculationList();
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {  
    calculate (){      
      this.$axios.post(API_URL+'/calcUsage/STD')
        .then(response => {
            this.gameDateRosters = response.data.gameDateRosterList;
            this.playerBenefitList = response.data.playerUsageList;
            this.getCalculationList();
        }) 
        .catch(error => {
            console.log(error);
        });
    },       
    getCalculationList(){
      this.$axios.get(API_URL+'/calculationIdList')
        .then(response => {
            this.calculationsList = response.data
        }) 
        .catch(error => {
            console.log(error);
        });
    }, 
    calculationIdChanged(item){
      this.getTeamBenefitList(item);
      this.getGameDateRosters(item);
    },
    getTeamBenefitList(item){
      this.$axios.get(API_URL+'/teamBenefitList/'+item.calcId)
        .then(response => {
            this.teamBenefitList = response.data
        }) 
        .catch(error => {
            console.log(error);
        });
    },     
    getGameDateRosters(item){     
      this.$axios.get(API_URL+'/calculations/'+item.calcId)
        .then(response => {
            this.gameDateRosters = response.data.gameDateRosterList;
            this.playerBenefitList = response.data.playerUsageList;            
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
