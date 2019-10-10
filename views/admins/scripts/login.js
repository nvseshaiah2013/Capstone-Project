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
                        prompt:'fill the required fields'
                    },
                    
                ]
            },
            password:{
                identifier:'password',
                rules:[
                    {
                        type:'empty',
                        prompt:'password is required'
                    }
                ]
            }
        }
    });
})