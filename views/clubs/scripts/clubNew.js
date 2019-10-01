function foundRemove(parent, input) {
    document.querySelector('#' + parent).removeChild(input.parentNode);
}
$(document).ready(function () {
    $(document).on('click', '#foundAdd',function () {
        $('<div class="two fields inline"> \
        <div class="twelve wide field"><input type="text" name="founders" data-validate="founder" placeholder="Name of Founder" /></div>\
            <button class= "ui icon button red" type = "button" onclick = "foundRemove(this)" > <i class="icon trash"></i></button>\
        </div>').appendTo('#founder');

        // let d = document.createElement('div');
        // $(d).addClass('two fields inline');
        // d.innerHTML = `
        //         <div class="twelve wide field"><input type="text" name="founders" data-validate="founder" placeholder="Name of Founder" /></div>                                     
        //         <button class="ui icon button red" type="button" onclick="foundRemove(this)"><i class="icon trash"></i></button>
        //         `;
        // $('#founder').append(d);
    });
    $('#addNum').bind('click', function () {
        let d = document.createElement('div');
        $(d).addClass('two fields inline');
        d.innerHTML = `
                <div class="twelve wide field"><input type="tel" name="phone_no" pattern="[1-9]{1}[0-9]{9}" placeholder="Enter Phone No. " /></div>
                <button class="ui icon button red" type="button" onclick="foundRemove('phone',this)" ><i class="icon trash"></i></button>
                `;
        $('#phone').append(d);
    });
    $('#addEmail').bind('click', function () {
        let d = document.createElement('div');
        $(d).addClass('two fields inline');
        d.innerHTML = `
                <div class="twelve wide field"><input type="email" name="email_id" placeholder="Enter Email Id. " /></div>
                <button class="ui icon button red" type="button" onclick="foundRemove('emails',this)"><i class="icon trash"></i></button></div>
                `;
        $('#emails').append(d);
    });

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
                    }
                ]
            },
            founders:{
                identifier:'founders',
                rules:[
                    {
                        type: 'empty',
                        prompt: 'It is a required field'
                    }
                ] 

            },
            founder:{
                identifier:'founders',
                rules:[
                    {
                        type: 'empty',
                        prompt: 'It is a required field'
                    }
                ]
            },
            phone_no: {
                identifier: 'phone_no',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Enter Phone No.'
                    },
                    {
                        type: 'exactLength[10]',
                        prompt: 'Length should be 10'
                    },
                    {
                        type: 'regExp[/^[1-9]{1}[0-9]{9}$/]',
                        prompt: 'Enter valid no'
                    }
                ]
            },
            email_id:{
                identifier:'email_id',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'Please fill the field'
                    },

                    {
                        type: 'email',
                        prompt: 'Please enter valid Email'
                    }
                ]
            }
        }
    });

    $('#newClub').submit(function(event){
        event.preventDefault();
        var f = $(this);
        if(f.form('is valid'))
        {
            console.log("Valid");
        }
    });
});