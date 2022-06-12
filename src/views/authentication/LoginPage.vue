<template>
    <div class="row g-0 auth-wrapper">
        <div class="col-12">
            <div class="auth-body mx-auto">
                <h2 class="text-center mb-5">Login</h2>
                <div class="auth-form-container">
                    <alert-component
                        v-if="alertMessage"
                        :type="alertType"
                        :message="alertMessage"
                        @close="onAlertMessageClose"
                    ></alert-component>

                    <form class="auth-form">
                        <div class="email mb-3">
                            <label class="sr-only" for="email">Email</label>
                            <input
                                id="email"
                                v-model="email"
                                name="email"
                                type="email"
                                class="form-control"
                                placeholder="Email"
                            />
                            <div v-if="v$.email.$error" class="error mt-2">
                                {{
                                    displayVuelidateError(
                                        v$.email.$errors,
                                        "Email"
                                    )
                                }}
                            </div>
                        </div>
                        <div class="password mb-3">
                            <label class="sr-only" for="password"
                                >Password</label
                            >
                            <input
                                id="password"
                                v-model="password"
                                name="password"
                                type="password"
                                class="form-control"
                                placeholder="Password"
                            />
                            <div v-if="v$.password.$error" class="error mt-2">
                                {{
                                    displayVuelidateError(
                                        v$.password.$errors,
                                        "Password"
                                    )
                                }}
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <button
                                type="button"
                                class="btn btn-primary w-100 mx-auto"
                                @click="onLogin()"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                    <div class="auth-option text-center pt-4">
                        No Account? Sign up
                        <router-link class="text-link" to="/register"
                            >Here</router-link
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import {computed, reactive, toRefs} from "vue";
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import { displayVuelidateError } from "../../helper/helper"
import AlertComponent from "../../components/Alert.vue"
import AuthService from "../../services/AuthService";
import { useRouter } from 'vue-router'

export default {
    name: "LoginPage",
    components: {
        AlertComponent,
    },
    setup() {
        const state = reactive({
            email: '',
            password: '',
            alertType: '',
            alertMessage: '',
        })

        /**
         * Validation rules
         */
        const rules = computed(() => ({
            email: { required, email },
            password: { required }
        }))

        const v$ = useVuelidate(rules, state)

        const router = useRouter()
        const authService = new AuthService(true);

        /**
         * Clear alert message when the alert close.
         */
        const onAlertMessageClose = () => {
            state.alertType = ""
            state.alertMessage = ""
        }

        /**
         * Login user into the dashboard.
         */
        const onLogin = () => {
            v$.value.$validate();

            let error = v$.value.$error ? true : false

            if (error) {
                return;
            }

            authService.login(state.email, state.password).then((result) => {
                if (result.status !== 200) {
                    if (result.response !== undefined) {
                        state.alertType = 'danger'
                        state.alertMessage = result.response.data.error
                    }
                } else {
                    let data = result.data.data;

                    window.localStorage.setItem('token', data.access_token);
                    window.localStorage.setItem('user_email', data.email);
                    window.localStorage.setItem('user_name', data.name);
                    window.localStorage.setItem('user_id', data._id);

                   router.push('/dashboard/appointments')
                }
            });
        }
        return {
            ...toRefs(state),
            v$,
            onAlertMessageClose,
            onLogin,
            displayVuelidateError
        }
    }
}
</script>
