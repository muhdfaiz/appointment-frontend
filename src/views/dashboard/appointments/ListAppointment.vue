<template>
    <section id="content-wrapper">
        <div class="row mb-3">
            <div class="col-md-12 d-flex justify-content-between">
                <h5>List Of Appointment</h5>
                <div>
                    <router-link
                        type="button"
                        class="btn btn-primary me-2"
                        to="/dashboard/appointments/create"
                        >Create New Appointment</router-link
                    >
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body pt-4">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Mobile Number</th>
                                        <th scope="col">Appointment Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="appointment in appointments"
                                        :key="appointment._id"
                                    >
                                        <td>{{ appointment.name }}</td>
                                        <td>{{ appointment.email }}</td>
                                        <td>{{ appointment.mobile_number }}</td>
                                        <td>
                                            {{
                                                moment(appointment.date).format(
                                                    "DD MMMM YYYY"
                                                )
                                            }}
                                        </td>
                                        <td>
                                            {{
                                                moment(
                                                    appointment.start_time,
                                                    "hh:ss"
                                                ).format("hh:ss A")
                                            }}
                                        </td>
                                        <td>
                                            <span
                                                v-if="
                                                    appointment.status ===
                                                    'confirmed'
                                                "
                                                class="badge bg-success"
                                                >{{ appointment.status }}</span
                                            >
                                            <span
                                                v-if="
                                                    appointment.status ===
                                                    'cancelled'
                                                "
                                                class="badge bg-danger"
                                                >{{ appointment.status }}</span
                                            >
                                        </td>
                                        <td class="d-flex">
                                            <template
                                                v-if="
                                                    appointment.date >
                                                        todayDate &&
                                                    appointment.status !==
                                                        'cancelled'
                                                "
                                            >
                                                <router-link
                                                    class="text-link"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="bottom"
                                                    title="Reschedule Appointment"
                                                    :to="
                                                        '/dashboard/appointments/reschedule/' +
                                                        appointment._id
                                                    "
                                                >
                                                    <font-awesome-icon
                                                        class="me-3"
                                                        size="2x"
                                                        :icon="[
                                                            'fas',
                                                            'clock-rotate-left',
                                                        ]"
                                                    />
                                                </router-link>

                                                <font-awesome-icon
                                                    class="me-3"
                                                    size="2x"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="bottom"
                                                    title="Cancel Appointment"
                                                    :icon="[
                                                        'fas',
                                                        'rectangle-xmark',
                                                    ]"
                                                    @click="
                                                        onCancelAppointment(
                                                            $event,
                                                            appointment
                                                        )
                                                    "
                                                />

                                                <a
                                                    target="_blank"
                                                    :href="
                                                        generateAddToCalendarUrl(
                                                            appointment
                                                        )
                                                    "
                                                >
                                                    <font-awesome-icon
                                                        class="me-3"
                                                        size="2x"
                                                        data-bs-toggle="tooltip"
                                                        data-bs-placement="bottom"
                                                        title="Add To Calendar"
                                                        :icon="[
                                                            'fas',
                                                            'calendar-plus',
                                                        ]"
                                                    />
                                                </a>
                                            </template>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import AppointmentService from "../../../services/AppointmentService";
import moment from "moment";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

export default {
    name: "ListAppointment",
    setup() {
        let todayDate = moment().format("YYYY-MM-DD");

        /**
         * Component states
         */
        const state = reactive({
            pageNumber: 1,
            pageLimit: 10,
            searchKeyword: "",
            appointments: [],
        });

        const appointmentService = new AppointmentService();

        /**
         * Cancel user appointment
         */
        const onCancelAppointment = async (event, appointment) => {
            let confirmation = await Swal.fire({
                title: `Are you sure want to cancel appointment on ${appointment.date} at ${appointment.start_time}?`,
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, cancel it!",
            });

            if (!confirmation.isConfirmed) {
                return;
            }

            let result = await appointmentService.cancelAppointment(
                appointment._id
            );

            if (result.success !== true) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            } else {
                getUserAppointments();

                Swal.fire(
                    "Cancelled!",
                    `Appointment on ${appointment.date} at ${appointment.start_time} has been successfully cancelled.`,
                    "success"
                );
            }
        };

        /**
         * Get appointments belongs to the user.
         */
        const getUserAppointments = async () => {
            const result = await appointmentService.getUserAppointments(
                state.pageNumber,
                state.pageLimit,
                state.searchKeyword
            );

            state.appointments = result.data;
        };

        /**
         * Generate add to calendar URL.
         */
        const generateAddToCalendarUrl = (appointment) => {
            let startDateTime = moment(
                appointment.date + " " + appointment.start_time,
                "YYYY-MM-DD HH:ss"
            ).subtract(8, "hours");
            let endDateTime = moment(
                appointment.date + " " + appointment.start_time,
                "YYYY-MM-DD HH:ss"
            ).subtract(8, "hours");
            return (
                "https://calendar.google.com/calendar/render?action=TEMPLATE&dates=" +
                startDateTime.format("YYYYMMDD") +
                "T" +
                startDateTime.format("HHss") +
                "00Z%2F" +
                endDateTime.format("YYYYMMDD") +
                "T" +
                endDateTime.format("HHss") +
                "00Z&text=SofaX%20Appointment"
            );
        };
        /**
         * Trigger when mounting the component.
         */
        onMounted(() => {
            // Retrieve list of appointments belongs to the user.
            getUserAppointments();
        });

        return {
            moment,
            todayDate,
            ...toRefs(state),
            onCancelAppointment,
            generateAddToCalendarUrl,
        };
    },
};
</script>
