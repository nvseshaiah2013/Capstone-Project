$(document).ready(function(){
    $('#createTeam').bind('click',function(evt){
        evt.preventDefault();
        $('#newTeam').modal('show');
    });
    $('.message .close')
        .on('click', function () {
            $(this)
                .closest('.message')
                .transition('fade')
                ;
        })
        ;
    $('#okTeam').bind('click',function(evt){
        if($('#new_team_name').val())
        {
             axios.post('/student/teams',{data:{"team_name":$('#new_team_name').val()}})
            .then(succ=>{
                console.log(succ.data);
                $('#mainPage').addClass('active');
            })
            .catch(fail=>{  
                console.log(fail.data);
            });
        }
        document.querySelector('#new_team_name').value = null;
        axios.get('/student/teams').then(result => {
            $('#store').html(result.data);
            if($('#mainPage').hasClass('active')){
                $('#mainPage').removeClass('active');
            }
        }).catch(err => {
            console.log(err);
            if ($('#mainPage').hasClass('active')) {
                $('#mainPage').removeClass('active');
            }
        });
    });
});

function addParticipant(teamId){
    $('#participantAdd').modal('show');
    $('#participantAddForm').on('click',function(evt){
        evt.preventDefault();
        secretToken = $('[name="secretToken"]').val();
        regn_no = $('[name="regn_no"]').val();
        console.log(regn_no + ' ' + secretToken);
        if(secretToken && regn_no)
        {
            axios.post('/student/teams/' + teamId + '/addMember',{data:{secretToken:secretToken,regn_no:regn_no}})
            .then(succ=>{
                console.log(succ.data);
            })
            .catch(fail=>{
                console.log(fail.data);
            });
        } 
        $('[name="secretToken"]').val('');
        $('[name="regn_no"]').val('');
    });
}

function markFinal(teamId){
   // console.log(teamId);
   $('#mainPage').addClass('active');
    axios.post('/student/teams/' + teamId + '/markFinal')
    .then((succ)=>{
        $('#mainPage').removeClass('active');
        console.log("Axios Data: " + succ.data);
    })
    .catch((fail)=>{
        $('#mainPage').removeClass('active');
        console.log("Failed: " + fail.data);
    });
}