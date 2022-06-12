import BaseService from "./BaseService";
import moment from "moment";

export default class AppointmentService extends BaseService {
    /**
     * Find user appointment
     *
     * @param {Number} appointmentID
     * @returns {Promise<*>}
     */
    findUserAppointment(appointmentID) {
        let url =
            this.baseURL +
            `/users/${localStorage.getItem(
                "user_id"
            )}/appointments/${appointmentID}`;

        return this.axios
            .get(url)
            .then((response) => {
                return response.data.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Get user appointments
     *
     * @param {Number} pageNumber
     * @param {Number} pageLimit
     * @param {String} search
     * @returns {Promise<*>}
     */
    getUserAppointments(pageNumber, pageLimit, search) {
        let url =
            this.baseURL +
            `/users/${localStorage.getItem(
                "user_id"
            )}/appointments?page=${pageNumber}&limit=${pageLimit}&search=${search}`;

        return this.axios
            .get(url)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Get all available dates slots including number of slots available for appointment.
     *
     * @returns {Promise<*>}
     */
    getAvailableAppointmentDates() {
        let url = this.baseURL + "/appointments/slots/all";

        return this.axios
            .get(url)
            .then((response) => {
                return response.data.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Get all available time slots on certain date for appointment.
     *
     * @param {String} date
     * @returns {Promise<*>}
     */
    getAvailableAppointmentTimesForSpecificDate(date) {
        let url = this.baseURL + "/appointments/slots?date=" + date;

        return this.axios
            .get(url)
            .then((response) => {
                return response.data.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Create new appointment.
     *
     * @param {Array} data
     * @returns {Promise<*>}
     */
    createNewAppointment(data) {
        let url =
            this.baseURL +
            "/users/" +
            localStorage.getItem("user_id") +
            "/appointments";

        let inputs = new FormData();
        inputs.append("name", data.name);
        inputs.append("email", data.email);
        inputs.append("mobile_number", data.mobile_number);
        inputs.append("date", data.selected_date);
        inputs.append("start_time", data.selected_time);
        inputs.append(
            "end_time",
            moment(data.selected_time, "hh:ss").add(1, "hours").format("HH:ss")
        );

        return this.axios
            .post(url, inputs)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Reschedule appointment.
     *
     * @param {Number} appointmentID
     * @param {Array} data
     * @returns {Promise<*>}
     */
    rescheduleAppointment(appointmentID, data) {
        let url =
            this.baseURL +
            "/users/" +
            localStorage.getItem("user_id") +
            "/appointments/" +
            appointmentID;

        let inputs = new FormData();
        inputs.append("date", data.new_selected_date);
        inputs.append("start_time", data.new_selected_time);
        inputs.append(
            "end_time",
            moment(data.new_selected_time, "hh:ss")
                .add(1, "hours")
                .format("HH:ss")
        );

        return this.axios
            .patch(url, inputs)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }

    /**
     * Cancel appointment.
     *
     * @param {Number} appointmentID
     * @returns {Promise<*>}
     */
    cancelAppointment(appointmentID) {
        let url =
            this.baseURL +
            "/users/" +
            localStorage.getItem("user_id") +
            "/appointments/" +
            appointmentID;

        return this.axios
            .delete(url)
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                console.error(error);
                return error;
            });
    }
}
