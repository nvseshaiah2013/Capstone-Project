function foundRemove(parent, input) {
    document.querySelector('#' + parent).removeChild(input.parentNode);
}
$(document).ready(function () {
    $(document).on('click', '#foundAdd',function () {
        $('<div class="two fields inline"> \
        <div class="twelve wide field"><input type="text" name="founders" data-validate="founder" placeholder="Name of Founder" /></div>\
            <button class= "ui icon button red" type = "button" onclick = "foundRemove(this)" > <i class="icon trash"></i></button>\
        </div>').appendTo('#founder');
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

    $('form').submit(function(event){
        event.preventDefault();
        var f = $(this);
        console.log(f);
        if(f.form('is valid'))
        {
            let founder = document.querySelectorAll('input[name="founders"]');
            let phone = document.querySelectorAll('input[name="phone_no"]');
            let email = document.querySelectorAll('input[name="email_id"]');
            let founders = [];
            let phones = [];
            let emails = [];
            var i=0;
            for(i=0;i<founder.length;++i)
            {
                founders.push(founder[i].value);
               // console.log(founder)
            }
            for(i=0;i<phone.length;++i)
            {
                phones.push(phone[i].value);
            }
            for(i=0;i<email.length;++i)
            {
                emails.push(email[i].value);
            }
            let Data = {
                club_name: $('input[name="club_name"]').val(),
                found_date: $('input[name="found_date"]').val(),
                password: $('input[name="password"]').val(),
                ceo: $('input[name="ceo"]').val(),
                username: $('input[name="username"]').val(),
                address: $('#address').val(),
                email_id:emails,
                founders:founders,
                phone_no:phones
            }
            axios.post('/clubs/add',
            {data:Data})
            .then((succ)=>{
                console.log("Success");
            })
            .catch((fail)=>{
                console.log(fail);
            });
            console.log("Valid");
        }
    });
});