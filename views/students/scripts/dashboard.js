$(document)
    .ready(function () {
        $('.ui.dropdown').dropdown();
        $('.ui.accordion').accordion();
        $('#allEvents').bind('click',function(evt){
            evt.preventDefault();
            axios.get('/student/events').then(result=>{               
               $('#store').html(result.data);
            }).catch(err=>{
                console.log(err);
            });
        });
        $('#teams').bind('click',function(evt){
            evt.preventDefault();
            axios.get('/student/teams').then(result=>{
                $('#store').html(result.data);
            }).catch(err=>{
                console.log(err);
            });
        });
    });

var selectedCategory;