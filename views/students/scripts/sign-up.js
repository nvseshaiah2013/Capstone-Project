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
        var f = $(this);
        if(f.form('is valid')){

            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize()
            }).done(function (data) {
                // Optionally alert the user of success here...
                console.log("reached");
            }).fail(function (data) {
                // Optionally alert the user of an error here...
            });
        }

    });

});