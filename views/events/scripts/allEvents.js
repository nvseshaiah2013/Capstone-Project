$(document).ready(function(){
    
});

function showEvent(eventId) {
    axios.get('/student/' + eventId + '/details')
        .then((succ) => {
            console.log("success");
            $('#store').html(succ.data);
        })
        .catch((fail) => {
            console.log(fail.data.message);
        });
}