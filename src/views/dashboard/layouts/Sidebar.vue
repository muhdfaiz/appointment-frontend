<template>
    <aside id="sidebar-wrapper">
        <div class="sidebar-brand">
            <h2>SofaX</h2>
        </div>
        <ul class="sidebar-nav">
            <li class="active">
                <router-link to="/dashboard/appointments">
                    <font-awesome-icon
                        class="ms-2 me-4"
                        :icon="['fas', 'calendar-days']"
                    />Appointments</router-link
                >
            </li>
        </ul>
    </aside>
</template>
