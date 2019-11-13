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


function successPayment(evt) {
    evt.preventDefault();
    $('#store').addClass('loading');
    axios.get('/payments/adminsPage/success')
        .then((response) => {
            $('#store').html(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    $('#store').removeClass('loading');
}


function failedPayment(evt) {
    evt.preventDefault();
    $('#store').addClass('loading');
    axios.get('/payments/adminsPage/failed')
        .then((response) => {
            $('#store').html(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    $('#store').removeClass('loading');
}
window.onload = successPayment;

function pendingPayment(evt) {
    evt.preventDefault();
    $('#store').addClass('loading');
    axios.get('/payments/adminsPage/pending')
        .then((response) => {
            $('#store').html(response.data);
        })
        .catch((err) => {
            console.log(err);
        })
    $('#store').removeClass('loading');
}



$(document).ready(function(){
    $('#newClub').on('click',clubNew);
    $('.ui.accordion').accordion();
    $('#admin_signout').on('click',adminSignOut);
    $('#viewSuccessTransactions').on('click', successPayment);
    $('#viewFailedTransactions').on('click', failedPayment);
    $('#viewPendingTransactions').on('click', pendingPayment);
});
