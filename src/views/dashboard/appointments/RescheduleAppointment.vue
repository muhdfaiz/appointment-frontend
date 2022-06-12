<template>
    <section id="content-wrapper">
        <div class="row mb-3">
            <div class="col-lg-12 d-flex justify-content-between">
                <h5>
                    Reschedule appointment on {{ oldSelectedDate }} at
                    {{ oldSelectedTime }}
                </h5>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body p-4">
                        <form>
                            <div class="row mt-3 mb-4">
                                <div class="col-md-7">
                                    <FullCalendar :options="calendarOptions" />
                                    <div
                                        v-if="v$.newSelectedDate.$error"
                                        class="col error mt-2"
                                    >
                                        {{
                                            displayVuelidateError(
                                                v$.newSelectedDate.$errors,
                                                "Appointment date"
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-5 mb-4">
                                <div
                                    v-if="
                                        newSelectedDate &&
                                        availableTimes.length > 0
                                    "
                                    class="col-md-7"
                                >
                                    <h5>
                                        Available times for
                                        {{ newSelectedDate }}
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
                                                        !newSelectedTime ||
                                                        newSelectedTime !==
                                                            time,
                                                    'btn-secondary':
                                                        newSelectedTime &&
                                                        newSelectedTime ===
                                                            time,
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
                                        !v$.newSelectedDate.$error &&
                                        v$.newSelectedTime.$error
                                    "
                                    class="error mt-2"
                                >
                                    {{
                                        displayVuelidateError(
                                            v$.newSelectedTime.$errors,
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
                                        @click="onRescheduleAppointment"
                                    >
                                        Reschedule
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
import { required } from "@vuelidate/validators";
import { displayVuelidateError } from "../../../helper/helper";
import "@fullcalendar/core/vdom";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentService from "../../../services/AppointmentService";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useRoute, useRouter } from "vue-router";

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
            date: null,
            newSelectedDate: null,
            oldSelectedDate: null,
            availableTimes: [],
            newSelectedTime: null,
            oldSelectedTime: null,
        });

        /**
         * Trigger when click on appointment slot in the calendar.
         */
        const onDateClick = async (info) => {
            let slotDate = moment(info.event.start).format("YYYY-MM-DD");
            state.newSelectedTime = null;
            state.newSelectedDate = slotDate;

            state.availableTimes =
                await appointmentService.getAvailableAppointmentTimesForSpecificDate(
                    slotDate
                );
        };

        /**
         * Trigger when user select time
         */
        const onSelectTime = async (selectedTime) => {
            state.newSelectedTime = selectedTime;
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
            newSelectedDate: { required },
            newSelectedTime: { required },
        }));

        const route = useRoute();
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
         * Retrieve appointment details
         */
        const getAppointmentDetails = async () => {
            let appointment = await appointmentService.findUserAppointment(
                route.params.id
            );

            state.oldSelectedDate = appointment.date;
            state.oldSelectedTime = appointment.start_time;
        };

        /**
         * Reschedule appointment to different date.
         */
        const onRescheduleAppointment = async () => {
            v$.value.$validate();

            let error = v$.value.$error ? true : false;

            if (error) {
                return;
            }

            let data = {
                new_selected_date: state.newSelectedDate,
                new_selected_time: state.newSelectedTime,
            };

            appointmentService
                .rescheduleAppointment(route.params.id, data)
                .then((result) => {
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
                            `Successfully reschedule the appointment on ${state.oldSelectedDate} at ${state.oldSelectedTime} to ${state.newSelectedDate} at ${state.newSelectedTime}`,
                            "success"
                        ).then(function () {
                            router.push({
                                path: "/dashboard/appointments",
                            });
                        });
                    }
                });
        };

        /**
         * Trigger during mount the component.
         */
        onMounted(async () => {
            await getAvailableSlots();
            await getAppointmentDetails();
        });

        return {
            moment,
            v$,
            ...toRefs(state),
            calendarOptions,
            displayVuelidateError,
            onSelectTime,
            onRescheduleAppointment,
        };
    },
};
</script>
