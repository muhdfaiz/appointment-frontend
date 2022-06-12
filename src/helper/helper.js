import moment from "moment";

/**
 *
 * Display validation error
 *
 * @param {Array} errors
 * @param {String} fieldName
 * @return {String}
 */
export const displayVuelidateError = (errors, fieldName) => {
    if (errors.length <= 0) {
        return;
    }

    return errors[0].$message.replace("Value", fieldName);
};

/**
 * Generate available appointment dates
 * @return {Array}
 */
export const generateAvailableAppointmentDates = () => {
    let startDate = moment().add(2, "days");
    let maxDate = startDate.clone().add(3, "weeks");

    let dates = [];
    let nextDate = startDate.clone();

    while (nextDate.isSameOrBefore(maxDate)) {
        nextDate = startDate.add(1, "days");

        let dayName = nextDate.clone().format("dddd");

        if (dayName !== "Saturday" && dayName !== "Sunday") {
            dates.push(nextDate.format("ddd, DD MMM YYYY"));
        }
    }
    return dates;
};
