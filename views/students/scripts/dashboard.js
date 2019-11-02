function getTeams(evt)
{
    evt.preventDefault();
    axios.get('/student/teams').then(result => {
        $('#store').html(result.data);
    }).catch(err => {
        console.log(err);
    });
}

/*
GET /upcomingEvents
GET /liveEvents
GET /pastEvents
*/
function getEvents(event)
{
    event.preventDefault();
    let loader = $('#loaderItem');
    loader.addClass('active');
    axios.get('/student/liveEvents')
        .then((response)=>{
            if(loader.hasClass('active')){
                loader.removeClass('active');
            }
            $('#showLiveEvents').html(response.data);
        })
        .catch((reject)=>{
            if (loader.hasClass('active')) {
                loader.removeClass('active');
            }
            console.log("Something Wrong " + reject.data);
        });
    axios.get('/student/upcomingEvents')
        .then((response) => {
            if (loader.hasClass('active')) {
                loader.removeClass('active');
            }
            $('#showUpcomingEvents').html(response.data);
        })
        .catch((reject) => {
            if (loader.hasClass('active')) {
                loader.removeClass('active');
            }
            console.log("Something Wrong " + reject.data);
        });
    axios.get('/student/pastEvents')
        .then((response) => {
            if (loader.hasClass('active')) {
                loader.removeClass('active');
            }
            $('#showPastEvents').html(response.data);
        })
        .catch((reject) => {
            if (loader.hasClass('active')) {
                loader.removeClass('active');
            }
            console.log("Something Wrong " + reject.data);
        });
}

$(document)
    .ready(function () {
        $('.ui.dropdown').dropdown();
        $('.ui.accordion').accordion();
        $('#allEvents').on('click',getEvents);
        $('#teams').on('click',getTeams);
        $('#student_signOut').on('click',function(evt){
            evt.preventDefault();
            $('#loaderItem').addClass('active');
            axios.post('/student/signout')
            .then((response)=>{
                delete axios.defaults.headers.common['Authorization'];
                localStorage.removeItem('__colors__');
                $('#formSignOut').submit();
            })
            .catch((error)=>{
                $('#formSignOut').submit();
            });            
        });
    });

var selectedCategory;