const moment = require("moment");

module.exports = {
    before:function(date1, date2)
    {
        // console.log("Date 1: " + date1);
        // console.log("Date 2: " + date2);
        // console.log("Date 1: " + moment(date1, 'YYYY-MM-DD'));
        // console.log("Date 2: " + moment(date2, 'YYYY-MM-DD'));
        return (moment(date1,'YYYY-MM-DD')).isBefore(moment(date2,'YYYY-MM-DD'));
    },
    after:function(date1, date2)
    {
        // console.log("Date 1: " + date1);
        // console.log("Date 2: " + date2);
        // console.log("Date 1: " + moment(date1, 'YYYY-MM-DD'));
        // console.log("Date 2: " + moment(date2, 'YYYY-MM-DD'));
        return (moment(date1,'YYYY-MM-DD')).isAfter(moment(date2,'YYYY-MM-DD'));
    },
    sameBefore:function(date1, date2)
    {
        // console.log("Date 1: " + date1);
        // console.log("Date 2: " + date2);
        // console.log("Date 1: " + moment(date1, 'YYYY-MM-DD'));
        // console.log("Date 2: " + moment(date2, 'YYYY-MM-DD'));
        return (moment(date1,'YYYY-MM-DD')).isSameOrBefore(moment(date2,'YYYY-MM-DD'));
    },
    sameOrAfterToday:function(date1){
        // console.log("Date 1: " + date1);
        // console.log("Date 2: " + date2);
        // console.log("Date 1: " + moment(date1, 'YYYY-MM-DD'));
        // console.log("Date 2: " + moment(date2, 'YYYY-MM-DD'));
        return moment(date1,'YYYY-MM-DD').isSameOrAfter(moment().format('YYYY-MM-DD'));
    }
};