function getTeams(evt)
{
    evt.preventDefault();
    axios.get('/student/teams').then(result => {
        $('#store').html(result.data);
    }).catch(err => {
        console.log(err);
    });
}

async function getEvents(event)
{
    event.preventDefault();
    let loader = $('#store');
    loader.addClass('loading');
    $('#store').html('');
    await axios.get('/student/liveEvents')
        .then((response)=>{
            if(loader.hasClass('loading')){
                loader.removeClass('loading');
            }
            $('#store').append($.parseHTML(response.data,null,true));
        })
        .catch((reject)=>{
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
    await axios.get('/student/upcomingEvents')
        .then((response) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            $('#store').append($.parseHTML(response.data, null, true));
        })
        .catch((reject) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
    await axios.get('/student/pastEvents')
        .then((response) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            $('#store').append($.parseHTML(response.data, null, true));
        })
        .catch((reject) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
}
window.onload = getEvents;

function imageGallery(event)
{
    event.preventDefault();
    let loader = $('#store');
    loader.addClass('loading');
    $('#store').html('');
    axios.get('/student/images/all')
    .then((response)=>{
        if (loader.hasClass('loading')) {
            loader.removeClass('loading');
        }
        $('#store').html(response.data);
    })
    .catch((reject)=>{
        if (loader.hasClass('loading')) {
            loader.removeClass('loading');
        }
        console.log("Something Wrong " + reject.data);
    });
}

function getLiveEvents(event)
{
    event.preventDefault();
    let loader = $('#store');
    loader.addClass('loading');
    $('#store').html('');
    axios.get('/student/liveEvents')
        .then((response) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            $('#store').html(response.data);
        })
        .catch((reject) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
}

function getPastEvents(event)
{
    event.preventDefault();
    let loader = $('#store');
    loader.addClass('loading');
    $('#store').html('');
    axios.get('/student/pastEvents')
        .then((response) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            $('#store').html(response.data);
        })
        .catch((reject) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
}

function getUpcomingEvents(event){
    event.preventDefault();
    let loader = $('#store');
    loader.addClass('loading');
    $('#store').html('');
    axios.get('/student/upcomingEvents')
        .then((response) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            $('#store').html(response.data);
        })
        .catch((reject) => {
            if (loader.hasClass('loading')) {
                loader.removeClass('loading');
            }
            console.log("Something Wrong " + reject.data);
        });
}

function getPic(imageLink, eventId) {
    console.log('h');
    console.log(imageLink);
    console.log(eventId);
    axios.post('/student/images/' + eventId + '/getImage', { data: imageLink })
        .then((response) => {
            console.log(response.data);
            $('#imagesgallery').append($.parseHTML(response.data));
        })
        .catch((err) => {
            console.log(err);
        });
}

$(document)
    .ready(function () {
        $('.ui.dropdown').dropdown();
        $('.ui.accordion').accordion();
        $('#allEvents').on('click',getEvents);
        $('#teams').on('click',getTeams);
        $('#pastEvents').on('click',getPastEvents);
        $('#liveEvents').on('click',getLiveEvents);
        $('#upcomingEvents').on('click',getUpcomingEvents);
        $('#viewImageGallery').on('click',imageGallery);
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
var selectedTeam;