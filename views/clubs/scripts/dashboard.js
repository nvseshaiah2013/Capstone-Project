function getOurEvents(event)
{
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/events/').then((succ) => {
        $('#store').html(succ.data);
    })
        .catch((err) => {
            console.log(err);
        });
    $('#mainPage').removeClass('loading');
}

function addNewEvent(evt)
{
    if(evt)
        evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/events/add').then(suc => {
        $('#store').html(suc.data);
    }).catch(err => {
        console.log(err);
    });
    $('#mainPage').removeClass('loading');
}

function clubSignOut(event){
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.post('/clubs/signout')
        .then((succ) => {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('__colors__');
            $('#formSignOut').submit();
        })
        .catch((err) => {
            $('#formSignOut').submit();
        });
    $('#mainPage').removeClass('loading');
}

function getProfile(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/profile')
    .then((response)=>{
        $('#store').html(response.data);
    })
    .catch((err)=>{

    });
    $('#mainPage').removeClass('loading');
}

function getPic(imageLink, eventId) {
    console.log('h');
    console.log(imageLink);
    console.log(eventId);
    axios.post('/clubs/images/' + eventId + '/getImage', { data: imageLink })
        .then((response) => {
            console.log(response.data);
            $('#imagesgallery').append($.parseHTML(response.data));
        })
        .catch((err) => {
            console.log(err.data);
        });
}

function getImageGallery(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/images/galleryPage')
    .then((response)=>{
        $('#store').html(response.data);
    })
    .catch((err)=>{
        console.log(err);
    })
    $('#mainPage').removeClass('loading');
}

function getVideoGallery(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/videos/galleryPage')
        .then((response) => {
            $('#store').html(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    $('#mainPage').removeClass('loading');
}

window.onload = getOurEvents;
$(document).ready(function () {    
    $('.ui.accordion').accordion();
    $('#addEvent').on('click',addNewEvent);
    $('#club_signout').on('click',clubSignOut);
    $('#ourEvents').on('click',getOurEvents);
    $('#myClubProfile').on('click',getProfile);
    $('#eventImages').on('click',getImageGallery);
    $('#eventVideos').on('click', getVideoGallery);
});

var selectedEvent;