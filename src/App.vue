<template>
  <v-app>
    <nav>
      <v-app-bar app
      absolute
      dense
      dark
      shrink-on-scroll
      src="../public/yahoo-fantasy.jpg" 
      >
        <v-toolbar-title class="headline text-uppercase">
          
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          x-large
          href="https://basketball.fantasysports.yahoo.com/"
          target="_blank"
        >
          <span class="mr-2">YAHOO! FANTASY NBA</span>
        </v-btn>
      </v-app-bar>          
      <v-content>
        <router-view/>
      </v-content>
    </nav> 
  </v-app>
</template>

<script>
export default {
  name: 'App',
}
</script>