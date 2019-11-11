function addParticipantForm(evt)
{
    evt.preventDefault();
    secretToken = $('[name="secretToken"]').val();
    regn_no = $('[name="regn_no"]').val();
    console.log(regn_no + ' ' + secretToken);
    if (secretToken && regn_no) {
        axios.post('/student/teams/' + selectedTeam + '/addMember', { data: { secretToken: secretToken, regn_no: regn_no } })
            .then(succ => {
                console.log(succ.data);
            })
            .catch(fail => {
                console.log(fail.data);
            });
    }
    $('[name="secretToken"]').val('');
    $('[name="regn_no"]').val('');
}

function addParticipant(teamId){
    selectedTeam = teamId;
    $('#participantAdd').modal('show');
}

function markFinal(teamId){
   // console.log(teamId);
   $('#mainPage').addClass('loading');
    axios.post('/student/teams/' + teamId + '/markFinal')
    .then((succ)=>{
        $('#mainPage').removeClass('loading');
        console.log("Axios Data: " + succ.data);
    })
    .catch((fail)=>{
        $('#mainPage').removeClass('loading');
        console.log("Failed: " + fail.data);
    });
}

function addTeamForm(evt)
{
    evt.preventDefault();
    $('#mainPage').addClass('loading');

    if ($('#new_team_name').val()) {
        axios.post('/student/teams', { data: { "team_name": $('#new_team_name').val() } })
            .then(succ => {
                console.log(succ.data);
                $('#mainPage').removeClass('loading');
            })
            .catch(fail => {
                console.log(fail.data);
                $('#mainPage').removeClass('loading');
            });
    }
    document.querySelector('#new_team_name').remove();
    axios.get('/student/teams').then(result => {
        $('#store').html(result.data);
        if ($('#mainPage').hasClass('loading')) {
            $('#mainPage').removeClass('loading');
        }
    }).catch(err => {
        console.log(err);
        if ($('#mainPage').hasClass('loading')) {
            $('#mainPage').removeClass('loading');
        }
    });
    if ($('#mainPage').hasClass('loading')) {
        $('#mainPage').removeClass('loading');
    }
}

$(document).ready(function () {
    $('#createTeam').bind('click', function (evt) {
        evt.preventDefault();
        $('#newTeam').modal('show');
    });
    $('#participantAddForm').on('click', addParticipantForm);
    $('.message .close')
        .on('click', function () {
            $(this)
                .closest('.message')
                .transition('fade')
                ;
        })
        ;
    $('#okTeam').on('click',addTeamForm);
});