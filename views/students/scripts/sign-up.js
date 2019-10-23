$(document).ready(function(){
    $('.ui.form').form({
        on:'blur',
        inline:true,
        fields:{
            username:{
                identifier:'username',
                rules:[
                    {
                        type:'empty',
                        prompt:'Please fill the field'
                    },

                    {
                        type:'email',
                        prompt:'Please enter valid Email'
                    }
                ]
            },
            name:{
                identifier:'name',
                rules:[
                    {
                        type:'empty',
                        prompt:'Please fill the field'
                    },
                    {
                        type: "regExp[/^(([A-Z]\.?\s?)*([A-Z][a-z]+\.?\s?)+([A-Z]\.?\s?[a-z]*)*)$/]",
                        prompt:'Enter valid name: First letter of every word should be capital'
                    }
                ]
            },
            reg_no:{
                identifier:'reg_no',
                rules:[
                    {
                        type:'empty',
                        prompt:'Please fill the field'
                    },
                    {
                        type:'exactLength[8]',
                        prompt:'The length should be of length 8'
                    }
                    ,
                    {
                        type:'regExp[/^[1]{2}[0-9]{6}$/]'
                    }
                ]

            },
            password:{
                identifier:'password',
                rules:[
                    {
                        type:'empty',
                        prompt:'Please enter password'
                    },
                    {
                        type:'minLength[8]',
                        prompt:'Atleast 8 characters should be there'
                    }
                ]
            },
            cnfm_password:{
                identifier:'cnfm_password',
                rules:[
                    {
                        type:'empty',
                        prompt:'This field cannot be empty'
                    },
                    {
                        type:'match[password]',
                        prompt:'Confirm password should match with password'
                    }
                ]
            },
            phone_no:{
                identifier:'phone_no',
                rules:[
                    {
                        type:'empty',
                        prompt:'Enter Phone No.'
                    },
                    {
                        type:'exactLength[10]',
                        prompt:'Length should be 10'
                    },
                    {
                        type:'regExp[/^[1-9]{1}[0-9]{9}$/]',
                        prompt:'Enter valid no'
                    }
                ]
            }
        }
    });
    $('form').submit(function(event){
        event.preventDefault();
        $('#signUpPage').addClass('loading');
        var f = $(this);
        if(f.form('is valid')){
            let formData = {
                username:$('[name="username"]').val(),
                password:$('[name="password"]').val(),
                phone_no:$('[name="phone_no"]').val(),
                reg_no:$('[name="reg_no"]').val(),
                name:$('[name="name"]').val()
            }
            axios.post('/student/signup',{data:formData}).then(succ=>{
                //console.log(succ);
                f.form('reset');
                $('#signUpPage').removeClass('loading');
                $('#sucMess').toggleClass('hidden');
                setTimeout(function(){
                    $('#sucMess').toggleClass('hidden');
                },2500);
                //console.log("Reached");
            }).catch(fail=>{
                //console.log(fail.response.data);
                f.form('reset');
                $('#failMess').append('<p> ' + fail.response.data.message + '</p>');
                $('#failMess').toggleClass('hidden');
                setTimeout(function () {
                    $('#failMess').toggleClass('hidden');
                }, 2500);
            })
        }

    });

});