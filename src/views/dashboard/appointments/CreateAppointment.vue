<template>
    <section id="content-wrapper">
        <div class="row mb-3">
            <div class="col-lg-12 d-flex justify-content-between">
                <h5>Schedule New Appointment</h5>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body p-4">
                        <form>
                            <div class="mb-4 row">
                                <h5 class="mb-5">Person Details</h5>
                                <label
                                    for="name"
                                    class="col-md-2 col-form-label"
                                    >Name</label
                                >
                                <div class="col-md-6 col-lg-5">
                                    <input
                                        id="name"
                                        v-model="name"
                                        name="name"
                                        type="text"
                                        class="form-control"
                                    />
                                    <div
                                        v-if="v$.name.$error"
                                        class="error mt-2"
                                    >
                                        {{
                                            displayVuelidateError(
                                                v$.name.$errors,
                                                "Name"
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4 row">
                                <label
                                    for="email"
                                    class="col-md-2 col-form-label"
                                    >Email</label
                                >
                                <div class="col-md-6 col-lg-5">
                                    <input
                                        id="email"
                                        v-model="email"
                                        name="email"
                                        type="email"
                                        class="form-control"
                                    />
                                    <div
                                        v-if="v$.email.$error"
                                        class="error mt-2"
                                    >
                                        {{
                                            displayVuelidateError(
                                                v$.email.$errors,
                                                "Email"
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <label
                                    for="inputPassword"
                                    class="col-md-2 col-form-label"
                                    >Mobile Number</label
                                >
                                <div class="col-md-6 col-lg-5">
                                    <input
                                        id="mobile_number"
                                        v-model="mobileNumber"
                                        name="mobile_number"
                                        type="text"
                                        class="form-control"
                                    />
                                    <div
                                        v-if="v$.mobileNumber.$error"
                                        class="error mt-2"
                                    >
                                        {{
                                            displayVuelidateError(
                                                v$.mobileNumber.$errors,
                                                "Mobile number"
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-7">
                                    <h5 class="my-5">
                                        Select Appointment Date & Time
                                    </h5>
                                    <FullCalendar :options="calendarOptions" />
                                    <div
                                        v-if="v$.selectedDate.$error"
                                        class="col error mt-2"
                                    >
                                        {{
                                            displayVuelidateError(
                                                v$.selectedDate.$errors,
                                                "Appointment date"
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-5 mb-4">
                                <div
                                    v-if="
                                        selectedDate &&
                                        availableTimes.length > 0
                                    "
                                    class="col-md-7"
                                >
                                    <h5>
                                        Available times for {{ selectedDate }}
                                    </h5>

                                    <div class="row mt-4">
                                        <div
                                            v-for="(
                                                time, index
                                            ) in availableTimes"
                                            :key="index"
                                            class="col-6 col-md-3 mb-3"
                                        >
                                            <button
                                                type="button"
                                                class="btn"
                                                :class="{
                                                    'btn-outline-secondary':
                                                        !selectedTime ||
                                                        selectedTime !== time,
                                                    'btn-secondary':
                                                        selectedTime &&
                                                        selectedTime === time,
                                                }"
                                                @click="onSelectTime(time)"
                                            >
                                                {{
                                                    moment(
                                                        time,
                                                        "hh:mm"
                                                    ).format("hh:mm a")
                                                }}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-if="
                                        !v$.selectedDate.$error &&
                                        v$.selectedTime.$error
                                    "
                                    class="error mt-2"
                                >
                                    {{
                                        displayVuelidateError(
                                            v$.selectedTime.$errors,
                                            "Appointment time"
                                        )
                                    }}
                                </div>
                            </div>

                            <div class="row mt-3 mb-2">
                                <div class="col-md-6 col-lg-7 text-end">
                                    <router-link
                                        type="button"
                                        class="btn btn-secondary me-2"
                                        to="/dashboard/appointments"
                                        >Go Back</router-link
                                    >
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        @click="onCreateNewAppointment"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { computed, reactive, toRefs, onMounted, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import {
    required,
    email,
    numeric,
    minLength,
    maxLength,
    helpers,
} from "@vuelidate/validators";
import { displayVuelidateError } from "../../../helper/helper";
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentService from "../../../services/AppointmentService";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useRouter } from "vue-router";

export default {
    name: "CreateAppointment",
    components: {
        FullCalendar,
    },
    setup() {
        const appointmentService = new AppointmentService();

        /**
         * Component states
         */
        const state = reactive({
            name: localStorage.getItem("user_name"),
            email: localStorage.getItem("user_email"),
            mobileNumber: "",
            date: null,
            selectedDate: null,
            availableTimes: [],
            selectedTime: null,
        });

        /**
         * Trigger when click on appointment slot in the calendar.
         */
        const onDateClick = async (info) => {
            let slotDate = moment(info.event.start).format("YYYY-MM-DD");
            state.selectedTime = null;
            state.selectedDate = slotDate;

            state.availableTimes =
                await appointmentService.getAvailableAppointmentTimesForSpecificDate(
                    slotDate
                );
        };

        /**
         * Trigger when user select time
         */
        const onSelectTime = async (selectedTime) => {
            state.selectedTime = selectedTime;
        };

        /**
         * Calendar config
         */
        const calendarOptions = ref({
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            events: [],
            height: 500,
            eventClick: onDateClick,
            eventColor: "#edfdf6",
            validRange: {
                start: moment().add(2, "days").format("YYYY-MM-DD"),
                end: moment().add(21, "days").format("YYYY-MM-DD"),
            },
            weekends: false,
            selectable: true,
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth",
            },
        });

        /**
         * Form validation
         */
        const rules = computed(() => ({
            name: { required },
            email: { required, email },
            mobileNumber: {
                required,
                numeric,
                minLength: minLength(10),
                maxLength: maxLength(12),
                containsValidMobileNumber: helpers.withMessage(
                    () => `Mobile number is invalid`,
                    (value) => /^(01)[0-46-9]*[0-9]{7,8}$/.test(value)
                ),
            },
            selectedDate: { required },
            selectedTime: { required },
        }));

        const router = useRouter();
        const v$ = useVuelidate(rules, state);

        /**
         * Retrieve available slots for each available dates.
         */
        const getAvailableSlots = async () => {
            calendarOptions.value.events =
                await appointmentService.getAvailableAppointmentDates();
        };

        /**
         * Create new appointment
         */
        const onCreateNewAppointment = async () => {
            v$.value.$validate();

            let error = v$.value.$error ? true : false;

            if (error) {
                return;
            }

            let data = {
                name: state.name,
                email: state.email,
                mobile_number: state.mobileNumber,
                selected_date: state.selectedDate,
                selected_time: state.selectedTime,
            };

            appointmentService.createNewAppointment(data).then((result) => {
                if (result.status !== 200) {
                    if (result.response !== undefined) {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                } else {
                    Swal.fire(
                        "Success!",
                        `Successfully schedule the appointment on ${state.selectedDate} at ${state.selectedTime}`,
                        "success"
                    ).then(function () {
                        router.push("/dashboard/appointments");
                    });
                }
            });
        };

        /**
         * Trigger during mount the component.
         */
        onMounted(async () => {
            await getAvailableSlots();
        });

        return {
            moment,
            v$,
            ...toRefs(state),
            calendarOptions,
            displayVuelidateError,
            onSelectTime,
            onCreateNewAppointment,
        };
    },
};
</script>
