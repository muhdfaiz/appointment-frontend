import { createWebHistory, createRouter } from "vue-router";

// Auth page components
const loginPage = () => import("@/views/authentication/LoginPage.vue");
const registerPage = () => import("@/views/authentication/RegisterPage.vue");

// Appointment page components
const layout = () => import("@/views/dashboard/layouts/Layout.vue");
const createAppointment = () =>
    import("@/views/dashboard/appointments/CreateAppointment.vue");
const listAppointment = () =>
    import("@/views/dashboard/appointments/ListAppointment.vue");
const rescheduleAppointment = () =>
    import("@/views/dashboard/appointments/RescheduleAppointment.vue");

const routes = [
    {
        path: "/",
        name: "Login",
        meta: { requiresAuth: false },
        component: loginPage,
    },
    {
        path: "/register",
        name: "Register",
        meta: { requiresAuth: false },
        component: registerPage,
    },
    {
        path: "/dashboard",
        name: "dashboard",
        meta: { requiresAuth: true },
        component: layout,
        children: [
            {
                path: "appointments",
                name: "appointment-list",
                meta: { requiresAuth: true },
                component: listAppointment,
            },
            {
                path: "appointments/create",
                name: "appointment-create",
                meta: { requiresAuth: true },
                component: createAppointment,
            },
            {
                path: "appointments/reschedule/:id",
                name: "appointment-reschedule",
                props: true,
                meta: { requiresAuth: true },
                component: rescheduleAppointment,
            },
        ],
    },
];

// Initialize vue router.
export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Router middleware. redirect to login page if user not login.
// Redirect to appointment pages if user already login.
router.beforeEach((to, from) => {
    // Redirect to dashboarc page if user already login.
    if (!to.meta.requiresAuth && localStorage.getItem("token")) {
        return {
            path: "/dashboard/appointments/create",
        };
    }

    // Redirect to login page if user trying to go to dashboard but not login.
    if (to.meta.requiresAuth && !localStorage.getItem("token")) {
        return {
            path: "/",
        };
    }
});
