<template>
    <v-container fluid>   
      <LeftMenu/>     
        <v-layout row wrap>
            <v-flex xs2>
            </v-flex>
            <v-flex xs9>
                <h1>This is a HOME page</h1>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import LeftMenu from '../components/LeftMenu';
export default {
  components:{
    LeftMenu
  },
}
</script>
