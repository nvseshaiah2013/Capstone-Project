function newClubForm(event)
{
    event.preventDefault();
    console.log(this);
    if ($('.ui.form').form('is valid')) {
        $('#store').addClass('loading');
        let Data = {
            club_name: $('input[name="club_name"]').val(),
            found_date: $('input[name="found_date"]').val(),
            password: $('input[name="password"]').val(),
            ceo: $('input[name="ceo"]').val(),
            username: $('input[name="username"]').val(),
            address: $('#address').val(),
        }
        axios.post('/clubs/add',
            { data: Data })
            .then((succ) => {
                //console.log("Success" + succ);
                $('#store').removeClass('loading');
            })
            .catch((fail) => {
                console.log(fail);
                $('#store').removeClass('loading');
            });
        // console.log("Valid");
    }
}

$(document).ready(function () {
    document.querySelector('[name="found_date"]').valueAsDate = moment().toDate();
    $.fn.form.settings.rules.isAfterOrEqual = function (value) {
        if (typeof value == 'undefined')
            return false;
        if (value == '')
            return false;
        return moment().isSameOrAfter(value);
    }
    $('.ui.form').form({
        inline:true,
        on:'blur',        
        fields:{
            club_name:{
                identifier:'club_name',
                rules:[
                {
                    type:'empty',
                    prompt:'It is a required Field'
                }
                ]
            },
            username:{
                identifier:'username',
                rules:[
                    {
                        type:'empty',
                        prompt:'It is a required Field'
                    },
                    {
                        type:'email',
                        prompt:'username should be a email'
                    }
                ]
            },
           ceo: {
                identifier:'ceo',
                rules:[
                    {
                        type:'empty',
                        prompt:'It is a required field'
                    }
                ]
            },
            password:{
                identifier:'password',
                rules:[
                    {
                        type:'empty',
                        prompt: 'It is a required field'
                    }
                    ,
                    {
                        type:'minLength[8]',
                        prompt:'Password should be of minimum 8 chars'
                    }
                ]
            },
            confirm_pwd:{
                identifier:'confirm_pwd',
                rules:[
                    {
                        type:'empty',
                        prompt:'It is a required field'
                    },
                    {
                        type:'match[password]',
                        prompt:'Passwords donot match'
                    }
                ]
            },
            found_date:{
                identifier:'found_date',
                rules:[
                    {
                        type:'empty',
                        prompt: 'It is a required field'
                    },
                    {
                        type:'isAfterOrEqual',
                        prompt:'Found Date cannot be beyond today'
                    }
                ]
            }
        }
    });
    $('#newClubButton').on('click',newClubForm);
});