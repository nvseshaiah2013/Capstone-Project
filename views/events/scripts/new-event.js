function remove(input) {
    document.getElementById('categories').removeChild(input.parentNode);
}
$(document).ready(function () {
    var id = 2;
    $('#eventForm').bind('click',function(event){
        event.preventDefault();
        let group_size = document.querySelectorAll('[name="group_size"]');
        let amount = document.querySelectorAll('[name="amount"]');
        let category_name = document.querySelectorAll('[name="category_name"]');
        let Categories = [];
        let length = category_name.length;
        for(var i=0;i<length;++i)
        {
            Categories.push({
                "catId":i,
                "category_name":category_name[i].value,
                "group_size":group_size[i].value,
                "amount":amount[i].value
            });
        }
        let Data = {
            event_name: $('[name="event_name"]').val(),
            start_date: $('[name="start_date"]').val(),
            end_date: $('[name="end_date"]').val(),
            reg_deadline:$('[name="reg_date"]').val(),
            prizes_worth:$('[name="prizes_worth"]').val(),
            venue:$('[name="venue"]').val(),
            misc_details:$('[name="misc_details"]').val(),
            categories:Categories
        };

        axios.post('/clubs/events',{
            data:Data}
            ).then(suc=>{
            console.log(suc);
        }).catch(err=>{
            console.log(err);
        })
    });

    $('#addCat').on('click', function () {
        let category = document.createElement('div');
        category.setAttribute('id', id);
        ++id;
        category.classList.add('ui');
        category.classList.add('segment');
        category.innerHTML = `
                <div class="header medium ui dividing red"> Category </div>
            <div class="sixteen wide field required">
                <label> Category Name </label>
                <input type="text" name="category_name" required />
            </div>
            <div class="sixteen wide field required">
                <label> Group Size </label>
                <input type="number" name="group_size" min="1" max="5" required/>
            </div>
            <div class="sixteen wide field required">
                <label> Amount </label>
                <input type="number" name="amount" required min="0" />
            </div>
            <div class="ui button red" onclick=remove(this)>
                Remove
                </div>
            `;
        document.querySelector('#categories').appendChild(category);
    });

});
