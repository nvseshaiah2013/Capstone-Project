$(document)
    .ready(function () {
        $('.ui.dropdown').dropdown();
        $('.ui.accordion').accordion();
        $('#allEvents').bind('click',function(evt){
            evt.preventDefault();
            axios.get('/student/events').then(result=>{
               console.log(result.data.events);
            }).catch(err=>{
                console.log(err);
            });
        })
    });