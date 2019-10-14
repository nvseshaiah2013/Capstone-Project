$(document).ready(function(){
    $('#newClub').bind('click',function(event){
        event.preventDefault();
        axios.get('/clubs/add').then(succ=>{
            $('#store').html(succ.data);
        }).catch(fail=>{
            $('#store').html('<b>Fetch Failed </b>');
        });
    })
});