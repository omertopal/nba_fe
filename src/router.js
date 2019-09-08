import Vue from 'vue'
import Router from 'vue-router'
import MyTeam from './views/MyTeam.vue'
import Schedule from './views/Schedule.vue'
import Players from './views/Players.vue'
import Teams from './views/Teams.vue'
import Injuries from './views/Injuries.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/myteam',
      name: 'myteam',
      component: MyTeam
    },    
    {
      path: '/schedule',
      name: 'schedule',
      component: Schedule
    }, 
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    }, 
    {
      path: '/players',
      name: 'players',
      component: Players
    }, 
    {
      path: '/injuries',
      name: 'injuries',
      component: Injuries
    }, 
  ]
})
