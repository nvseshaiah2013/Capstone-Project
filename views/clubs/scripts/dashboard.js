function getOurEvents(event)
{
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/events/').then((succ) => {
        $('#store').html(succ.data);
        $('#mainPage').removeClass('loading');

    })
        .catch((err) => {
            console.log(err);
            $('#mainPage').removeClass('loading');
        });
}

function addNewEvent(evt)
{
    if(evt)
        evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/events/add').then(suc => {
        $('#store').html(suc.data);
        $('#mainPage').removeClass('loading');

    }).catch(err => {
        console.log(err);
        $('#mainPage').removeClass('loading');
    });
}

function clubSignOut(event){
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.post('/clubs/signout')
        .then((succ) => {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('__colors__');
            $('#formSignOut').submit();
            $('#mainPage').removeClass('loading');

        })
        .catch((err) => {
            $('#mainPage').removeClass('loading');
            $('#formSignOut').submit();
        });
}

function getProfile(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/profile')
    .then((response)=>{
        $('#store').html(response.data);
        $('#mainPage').removeClass('loading');

    })
    .catch((err)=>{

        $('#mainPage').removeClass('loading');
    });
}

function getPic(imageLink, eventId) {
    // console.log('h');
    // console.log(imageLink);
    // console.log(eventId);
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
        $('#mainPage').removeClass('loading');

    })
    .catch((err)=>{
        console.log(err);
        $('#mainPage').removeClass('loading');
    })
}

function getVideoGallery(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/videos/galleryPage')
        .then((response) => {
            $('#store').html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch((err) => {
            console.log(err);
            $('#mainPage').removeClass('loading');
        })
}


function successPayment(evt) {
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/payments/clubsPage/success')
        .then((response) => {
            $('#store').html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch((err) => {
            console.log(err);
            $('#mainPage').removeClass('loading');

        })
    
}


function failedPayment(evt) {
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/payments/clubsPage/failed')
        .then((response) => {
            $('#store').html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch((err) => {
            console.log(err);
            $('#mainPage').removeClass('loading');

        })
   
}


function pendingPayment(evt) {
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/payments/clubsPage/pending')
        .then((response) => {
            $('#store').html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch((err) => {
            console.log(err);
            $('#mainPage').removeClass('loading');

        })
   
}

function viewFeedback(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/eventNames')
    .then((response)=>{
        $('#store').html(response.data);
        $('#mainPage').removeClass('loading');

    })
    .catch((err)=>{
        console.log(err);
        $('#mainPage').removeClass('loading');

    })
}

function issuedCertificates(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/issuedCertificates')
    .then((response)=>{
        $("#store").html(response.data);
        $('#mainPage').removeClass('loading');

    })
    .catch(err=>{
        console.log(err);
        $('#mainPage').removeClass('loading');
    });

}

function viewRegisteredTeams(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/eventNames1')
        .then((response) => {
            $("#store").html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch(err => {
            console.log(err);
            $('#mainPage').removeClass('loading');
        });

}

function issueCertPastEvent(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/pastEventList')
        .then((response) => {
            $("#store").html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch(err => {
            console.log(err);
            $('#mainPage').removeClass('loading');
        });
}

function changePassword(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/changePassword')
        .then((response) => {
            $("#store").html(response.data);
            $('#mainPage').removeClass('loading');

        })
        .catch(err => {
            console.log(err);
            $('#mainPage').removeClass('loading');
        });
}

function upDetails(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/updateDetails')
    .then((response)=>{
        $('#store').html(response.data);
        $('#mainPage').removeClass('loading');

    })
    .catch(err=>{
        console.log(err);
        $('#mainPage').removeClass('loading');
    });
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
    $('#viewAllSuccess').on('click', successPayment);
    $('#viewAllFailed').on('click', failedPayment);
    $('#viewAllPending').on('click', pendingPayment);
    $('#ourFeedback').on('click',viewFeedback);
    $('#viewIssuedCerts').on('click',issuedCertificates);
    $('#viewRegisteredTeams').on('click',viewRegisteredTeams);
    $('#issueNewCert').on('click',issueCertPastEvent);
    $('#upDetails').on('click',upDetails);
    // $('#changePassword').on('click',changePassword);
});

var selectedEvent;