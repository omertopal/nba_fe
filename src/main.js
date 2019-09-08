import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import  store  from  './store'
import  axios  from  'axios'


Vue.config.productionTip = false
Vue.prototype.$axios  =  axios;

axios.interceptors.request.use(function(config) {        
  config.headers.common['access_token'] = localStorage.getItem('access_token');
  config.headers.common['refresh_token'] = localStorage.getItem('refresh_token');  
  return config;
}, function(error) {
  return Promise.reject(error);
});   

axios.interceptors.response.use((response) => {
  if (response.status === 401) {
      router.push("/login") 
  } 
  localStorage.setItem('access_token', response.headers.access_token);
  return response;
  
  }, function (error) {
      if (error.response.status === 401) {          
          router.push('/login')
      }
      return Promise.reject(error);
  });

new Vue({
  vuetify,
  router,
  store,  
  render: h => h(App)
}).$mount('#app')
