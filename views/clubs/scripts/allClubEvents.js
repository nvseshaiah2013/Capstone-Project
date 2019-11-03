function showDetails(eventId)
{
    axios.get('/clubs/events/' + eventId + '/addCategory')
    .then((succ)=>{
        $('#store').html(succ.data);
    })
    .catch((err)=>{
        console.log(err);
    });
}
