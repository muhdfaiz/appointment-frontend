<template>
    <div class="row g-0 auth-wrapper">
        <div class="col-12">
            <div class="d-flex flex-column align-content-end">
                <div class="auth-body mx-auto">
                    <h2 class="text-center mb-5">Register New Account</h2>

                    <div class="auth-form-container">
                        <alert-component
                            v-if="alertMessage"
                            :type="alertType"
                            :message="alertMessage"
                            @close="onAlertMessageClose"
                        ></alert-component>

                        <form class="auth-form">
                            <div class="email mb-3">
                                <label class="sr-only" for="name">Name</label>
                                <input
                                    id="name"
                                    v-model="name"
                                    name="name"
                                    type="text"
                                    class="form-control"
                                    placeholder="Name"
                                />
                                <div v-if="v$.name.$error" class="error mt-2">
                                    {{
                                        displayVuelidateError(
                                            v$.name.$errors,
                                            "Name"
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="mb-3">
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
                                <label class="sr-only" for="signup-password"
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
                                <div
                                    v-if="v$.password.$error"
                                    class="error mt-2"
                                >
                                    {{
                                        displayVuelidateError(
                                            v$.password.$errors,
                                            "Password"
                                        )
                                    }}
                                </div>
                            </div>
                            <div class="password mb-3">
                                <label class="sr-only" for="signup-password"
                                    >Password Confirmation</label
                                >
                                <input
                                    id="password-confirmation"
                                    v-model="passwordConfirmation"
                                    name="password_confirmation"
                                    type="password"
                                    class="form-control"
                                    placeholder="Password Confirmation"
                                />
                                <div
                                    v-if="v$.passwordConfirmation.$errors"
                                    class="error mt-2"
                                >
                                    {{
                                        displayVuelidateError(
                                            v$.passwordConfirmation.$errors,
                                            "Password confirmation"
                                        )
                                    }}
                                </div>
                            </div>

                            <div class="text-center">
                                <button
                                    type="button"
                                    class="btn btn-primary w-100 mx-auto"
                                    @click="onRegister()"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>

                        <div class="auth-option text-center pt-4">
                            Already have an account?
                            <router-link class="text-link" to="/"
                                >Login</router-link
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import { computed, reactive, toRefs } from "vue";
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, minLength, sameAs } from '@vuelidate/validators'
import { displayVuelidateError } from "../../helper/helper"
import AlertComponent from "../../components/Alert.vue"
import AuthService from "../../services/AuthService";
import { useRouter } from 'vue-router'

export default {
    name: "RegisterPage",
    components: {
        AlertComponent
    },
    setup() {
        const state = reactive({
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            alertType: '',
            alertMessage: ''
        })

        const rules = computed(() => ({
            name: { required },
            email: { required, email },
            password: {
                required,
                minLength: minLength(6),
                containsPasswordRequirement: helpers.withMessage(
                () => `The password requires an uppercase, lowercase, number and special character`,
                (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(value)
                ),
            },
            passwordConfirmation: { required, sameAsPassword: sameAs(state.password) },
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
         * Register new user
         */
        const onRegister = () => {
            v$.value.$validate();

            let error = v$.value.$error ? true : false

            if (error) {
                return;
            }

            authService.register(state.name, state.email, state.password).then((result) => {
                if (result.status !== 200) {
                    if (result.response !== undefined) {
                        state.alertType = 'danger'
                        state.alertMessage = result.response.data.error
                    }
                } else {
                    let data = result.data.data;

                    window.localStorage.setItem('token', data.access_token);
                    window.localStorage.setItem('user_id', data._id);
                    window.localStorage.setItem('user_email', data.email);
                    window.localStorage.setItem('user_name', data.name);

                   router.push('/dashboard/appointments')
                }
            });
        }

        return {
            ...toRefs(state),
            v$,
            displayVuelidateError,
            onAlertMessageClose,
            onRegister,
        }
    }
}
</script>
