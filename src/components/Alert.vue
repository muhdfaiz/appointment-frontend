<template>
    <div :class="'alert-' + type" class="alert show" role="alert">
        {{ message }}
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="hideAlertMessage"
        ></button>
    </div>
</template>

<script>
export default {
    name: "AlertComponent",
    props: {
        type: {
            type: String,
            default: "success",
        },
        message: {
            type: String,
            required: true,
        },
    },
    emits: ["close"],
    setup(props, { emit }) {
        /**
         * Hide alert message
         */
        const hideAlertMessage = () => {
            emit("close");
        };

        return {
            hideAlertMessage,
        };
    },
};
</script>
