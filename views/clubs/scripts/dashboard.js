$(document).ready(function () {
    
    $('.ui.accordion').accordion();
    $('#addEvent').bind('click',function(evt){
        evt.preventDefault();
        axios.get('/clubs/events/add').then(suc=>{
            $('#store').html(suc.data);
        }).catch(err=>{
            console.log(err);
        })
    });
});

var selectedEvent;