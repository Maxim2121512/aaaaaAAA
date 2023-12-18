import Login from "@/components/Login.vue";
import Market from "@/components/Market.vue";
import History from "@/components/History.vue";
import Admin from "@/components/Admin.vue";

const routes = [
    {path: '/login', component: Login, name: 'login'},
    {path:'/market', component: Market, name: 'market'},
    {path:'/history/:label', component: History, name: 'history'},
    {path: '/admin', component: Admin, name: 'admin'}
]

export default routes;