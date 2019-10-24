$(document).ready(function () {
    $.fn.form.settings.rules.validDate = function(value)
    {
        if(typeof value == 'undefined')
            return false;
        if(value == '')
            return false;
        return moment(value).isValid();
    }
    $.fn.form.settings.rules.isBeforeOrEqual = function(value,identifier)
    {
        if (typeof value == 'undefined' || typeof identifier == 'undefined')
            return false;
        if (value == '' || identifier == '')
            return false;
        return moment(document.querySelector('[name=' + identifier +']').value).isSameOrAfter(value);
    }
    $.fn.form.settings.rules.isAfterOrEqual = function(value,identifier)
    {
        if (typeof value == 'undefined' || typeof identifier == 'undefined')
            return false;
        if (value == '' || identifier == '')
            return false;
        return moment(document.querySelector('[name=' + identifier + ']').value).isSameOrBefore(value);        
    }

    $('.ui.form').form({
        on:'blur',
        inline:true,
        fields:{
            event_name:{
                identifier:'event_name',
                rules:[
                    {
                        type:'empty',
                        prompt:'Event name is Necessary'
                    }
                ]
            }
            ,
            prizes_worth:{
                identifier:'prizes_worth',
                rules:[
                    {
                        type:'empty',
                        prompt:'This field should not be empty'
                    },
                    {
                        type:'integer[1..10000000]',
                        prompt:'This field must contain integer values'
                    }
                ]
            }
            ,
            start_date:{
                identifier:'start_date',
                rules:[
                    {
                        type:'empty',
                        prompt:'This field should not be empty'
                    },
                    {
                        type:'validDate',
                        prompt:'The date entered is invalid'
                    },
                    {
                        type:'isAfterOrEqual[reg_date]',
                        prompt:'Event start date should be atleast the next day of registration'
                    }
                ]
            },
            end_date: {
                identifier: 'end_date',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'This field should not be empty'
                    }
                    ,
                    {
                        type: 'validDate',
                        prompt: 'The date entered is invalid'
                    }
                    ,
                    {
                        type: 'isAfterOrEqual[start_date]',
                        prompt: 'Event end date should be atleast the next day of start_date'
                    }
                ]
            },
            reg_date: {
                identifier: 'reg_date',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'This field should not be empty'
                    }
                    ,
                    {
                        type: 'validDate',
                        prompt: 'The date entered is invalid'
                    }
                    ,
                    {
                        type:'isBeforeOrEqual[start_date]',
                        prompt:'registration date must be before start date'
                    }

                ]
            }
        }
    });
    document.querySelector('[name="start_date"]').valueAsDate = (moment().add(2,'days')).toDate();
    document.querySelector('[name="end_date"]').valueAsDate = (moment().add(2, 'days')).toDate();
    document.querySelector('[name="reg_date"]').valueAsDate = (moment().add(1, 'days')).toDate();
    $('#eventForm').bind('click',function(event){
        event.preventDefault();
        $('#mainPage').addClass('loading');
        let Data = {
            event_name: $('[name="event_name"]').val(),
            start_date: $('[name="start_date"]').val(),
            end_date: $('[name="end_date"]').val(),
            reg_deadline:$('[name="reg_date"]').val(),
            prizes_worth:$('[name="prizes_worth"]').val(),
            venue:$('[name="venue"]').val(),
            misc_details:$('[name="misc_details"]').val()
        };

        axios.post('/clubs/events',{data:Data})
        .then(suc=>{
           if( $('#mainPage').hasClass('loading') )
           {
               $('#mainPage').removeClass('loading');
           }
            console.log(suc);
        })
        .catch(err=>{
            console.log(err);
        })
    });
});
