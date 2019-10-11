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
                console.log(succ.response);
            })
            .catch(fail=>{  
                console.log(fail.response);
            });
        }
    });
});

function addParticipant(teamId){
    $('#participantAdd').modal('show');
    $('#participantAddForm').on('click',function(evt){
        secretToken = $('[name="secretToken"]').val();
        regn_no = $('[name="regn_no"]').val();
        console.log(regn_no + ' ' + secretToken);
        if(secretToken && regn_no)
        {
            axios.post('/student/teams/' + teamId + '/addMember',{data:{secretToken:secretToken,regn_no:regn_no}})
            .then(succ=>{
                console.log(succ);
            })
            .catch(fail=>{
                console.log(fail);
            });
        } 
        $('[name="secretToken"]').val('');
        $('[name="regn_no"]').val('');
    });
}

function markFinal(teamId){
    console.log(teamId);
    axios.post('/student/teams/' + teamId + '/markFinal')
    .then((succ)=>{
        console.log("Axios Data: " + succ.response.data);
    })
    .catch((fail)=>{
        console.log("Failed: " + fail.response.data);
    });
}