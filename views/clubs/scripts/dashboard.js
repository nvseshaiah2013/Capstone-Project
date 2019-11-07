function getOurEvents(event)
{
    event.preventDefault();
    axios.get('/clubs/events/').then((succ) => {
        $('#store').html(succ.data);
    })
        .catch((err) => {
            console.log(err);
        });
}

function addNewEvent(evt)
{
    if(evt)
        evt.preventDefault();
    axios.get('/clubs/events/add').then(suc => {
        $('#store').html(suc.data);
    }).catch(err => {
        console.log(err);
    })
}

function clubSignOut(event){
    event.preventDefault();
    $('#loaderItem').addClass('active');
    axios.post('/clubs/signout')
        .then((succ) => {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('__colors__');
            $('#formSignOut').submit();
        })
        .catch((err) => {
            $('#formSignOut').submit();
        });
}


window.onload = getOurEvents;
$(document).ready(function () {    
    $('.ui.accordion').accordion();
    $('#addEvent').on('click',addNewEvent);
    $('#club_signout').on('click',clubSignOut);
    $('#ourEvents').on('click',getOurEvents);
});

var selectedEvent;