
<template>     
    <v-navigation-drawer app
      v-model="drawer"
      :color="backgroundcolor"
      :expand-on-hover="expandOnHover"
      :mini-variant="miniVariant"
      :right="right"
      :src="bg"          
      dark
    >
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item two-line>
          <v-list-item-avatar> 
            <v-icon large dark>mdi-basketball mdi-spin</v-icon>            
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>Legends League</v-list-item-title>
            <v-list-item-subtitle>Bosphorus Heat</v-list-item-subtitle>                
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.link"
          link
          active-class="black--text"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      
        <v-divider></v-divider>
        
      </v-list>

    </v-navigation-drawer>
</template>

<script>
export default {
    name : 'LeftMenu',
    data () {
        return {
        userNameSurname: {},
        userTitle: {},
        drawer: true,
        backgroundcolor: 'primary',
        items: [
            { title: 'My Team',link: 'myteam',  icon: 'mdi-basketball-hoop-outline' },  
            {title: 'Calculations',link: 'calculations',  icon: 'mdi-calculator'  },        
            { title: 'Schedule', link: 'schedule',  icon: 'mdi-calendar-clock' },
            {title: 'Teams',link: 'teams',  icon: 'mdi-account-group'  },
            {title: 'Players',link: 'players',  icon: 'mdi-account-circle'  },
            {title: 'Injuries',link: 'injuries',  icon: 'mdi-hospital-box'  },
        ],                        
        right: false,
        miniVariant: false,
        expandOnHover: true,
        background: true,
        }
    },
    beforeMount() {
      if (localStorage.user_name_surname) {
        this.userNameSurname = localStorage.getItem('user_name_surname');
        this.userTitle = localStorage.getItem('user_title');
      }
    },
    computed: {
        bg () {
        return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
        },
    },
}
</script>