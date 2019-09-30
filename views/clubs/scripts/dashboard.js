$(document).ready(function () {
    $('#createEvent').bind('click', function () {
        axios.get('/clubs/events/add').then(function (response) {
            //console.log(response);
            $('#store').html(response.data);
        }).catch(err => {
            console.log(err);
        });
    });
    $('.ui.accordion').accordion();
    $('#addEvent').bind('click',function(evt){
        evt.preventDefault();
    });
});