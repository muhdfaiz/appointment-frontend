import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";

/* Import bootstrap */
import "bootstrap";
import { Tooltip } from "bootstrap";

/* Import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* Import specific icons */
import {
    faCalendarDays,
    faBars,
    faRectangleXmark,
    faClockRotateLeft,
    faCalendarPlus,
} from "@fortawesome/free-solid-svg-icons";

/* Import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* Add icons to the library */
library.add(
    faCalendarDays,
    faBars,
    faRectangleXmark,
    faClockRotateLeft,
    faCalendarPlus
);

// Initialize vue.
createApp(App)
    .use(router)
    .component("font-awesome-icon", FontAwesomeIcon)
    .mount("#app");

// Enable bootstrap tooltip everywhere
var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new Tooltip(tooltipTriggerEl);
});
