import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'dashboard',
        props: true,
        component: () => import('../components/dashboard.vue') //sets route / to /dashboard.vue
    },
    {
        path: '/intakeform',
        name: 'intakeForm',
        props: true,
        component: () => import('../components/intakeForm.vue') //sets route /intake form to /intakeform.vue
    },
    {
        path: '/findclient',
        name: 'findClient',
        component: () => import('../components/findClient.vue') //sets route /findclient to /findclient.vue
    },
    {
        path: '/updateclient/:id',
        name: 'updateclient',
        props: true,
        component: () => import('../components/updateClient.vue') //sets route /updateclient/id to /updateclient.vue
    },
    {
        path: '/eventform',
        name: 'eventform',
        component: () => import('../components/eventForm.vue') //sets route /eventform to /eventform.vue
    },
    {
        path: '/findEvents',
        name: 'findEvents',
        component: () => import('../components/findEvents.vue') //sets route /findevents to /findevents.vue
    },
    {
        path: '/eventDetails/:id',
        name: 'eventdetails',
        props: true,
        component: () => import('../components/eventDetails.vue') //sets route /eventdetails/id to eventdetails.vue
    }
]
const router = createRouter({
    history: createWebHistory(), routes
})
export default router