<template>
    <div id="wrapper">
        <header-component></header-component>
        <sidebar-component></sidebar-component>

        <div class="app-wrapper">
            <div class="app-content pt-3 p-md-3 p-lg-4">
                <div class="container-fluid">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderComponent from "./Header.vue";
import SidebarComponent from "./Sidebar.vue";

export default {
    name: "LayoutComponent",
    components: {
        HeaderComponent,
        SidebarComponent,
    },
};
</script>
