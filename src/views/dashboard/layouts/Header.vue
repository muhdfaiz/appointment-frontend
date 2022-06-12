<template>
    <div id="navbar-wrapper">
        <nav class="navbar navbar-inverse">
            <div class="navbar-header">
                <a
                    id="sidebar-toggle"
                    href="#"
                    class="navbar-brand"
                    @click="toggleSidebar"
                >
                    <font-awesome-icon :icon="['fas', 'bars']" />
                </a>

                <div class="dropdown">
                    <div
                        id="dropdownMenuButton1"
                        class="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img class="avatar" src="../../../assets/avatar.png" />
                    </div>
                    <ul
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                    >
                        <li @click="onLogout">
                            <a class="dropdown-item" href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
    name: "HeaderComponent",
    setup() {
        const userName = window.localStorage.getItem("user_name");

        const router = useRouter();

        /**
         * Logout user from application
         */
        const onLogout = () => {
            window.localStorage.clear();
            router.push("/");
        };

        /**
         * Toggle sidebar
         */
        const toggleSidebar = () => {
            document.querySelector("#wrapper").classList.toggle("toggled");
        };
        return {
            userName,
            onLogout,
            toggleSidebar,
        };
    },
};
</script>
