function clubNew(event)
{
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.get('/clubs/add').then(succ => {
        $('#store').html(succ.data);
        if($('#mainPage').hasClass('loading'))
            $('#mainPage').removeClass('loading');
    }).catch(fail => {
       if($('#mainPage').hasClass('loading'))
           $('#mainPage').removeClass('loading');
        console.log(fail);
    });
}

function adminSignOut(event)
{
    event.preventDefault();
    $('#mainPage').addClass('loading');
    axios.post('/admins/signout')
        .then((succ) => {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('__colors__');
            $('#formSignOut').submit();
        })
        .catch((err) => {
            $('#formSignOut').submit();
        });
}


$(document).ready(function(){
    $('#newClub').on('click',clubNew);
    $('.ui.accordion').accordion();
    $('#admin_signout').on('click',adminSignOut);
});
