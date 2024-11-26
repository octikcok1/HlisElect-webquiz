import { createRouter, createWebHistory } from 'vue-router';
import SelectQuestion from '../components/SelectQuestion.vue'
import CodeInput from '../components/CompareCode.vue'
import NotFound from '../components/404.vue'


const router = createRouter({
  history: createWebHistory(),
  routes:[
    { path: '/', name: 'SelectQuestion', component: SelectQuestion },
    { path: '/compare/:name/:question/:score/:answer/:positionNumber', name: 'CompareCode', component: CodeInput, props: true },
    {path: '/:catchAll(.*)',name: 'NotFound' , component: NotFound},
  ],
});
export default router

