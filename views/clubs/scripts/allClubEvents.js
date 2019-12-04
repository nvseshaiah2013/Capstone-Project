function showDetails(eventId)
{
    $('#mainPage').addClass('loading');
    axios.get('/clubs/events/' + eventId + '/addCategory')
    .then((succ)=>{
        $('#store').html(succ.data);
        $('#mainPage').removeClass('loading');
    })
    .catch((err)=>{
        console.log(err);
        $('#mainPage').removeClass('loading');

    });
}
