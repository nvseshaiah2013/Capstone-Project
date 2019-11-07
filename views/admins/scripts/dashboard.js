$(document).ready(function(){
    $('#newClub').bind('click',function(event){
        event.preventDefault();
        axios.get('/clubs/add').then(succ=>{
            $('#store').html(succ.data);
        }).catch(fail=>{
            $('#store').html('<b>Fetch Failed </b>');
        });
    });
    $('.ui.accordion').accordion();
    init();
    $('#admin_signout').on('click',function(event){
        event.preventDefault();
        $('#loaderItem').addClass('active');
        axios.post('/admins/signout')
        .then((succ)=>{
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('__colors__');
            $('#formSignOut').submit();
        })
        .catch((err)=>{
            $('#formSignOut').submit();
        });
    });
});

function init(){
    $('#store').html("<h1><b>Hello World</b></h1>");
}