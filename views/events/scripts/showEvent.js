function showTeams(categoryId){
    if(categoryId)
    {
        selectedCategory = categoryId;
        axios.get('/student/'+ categoryId + '/Ownedteams')
        .then((succ)=>{
            $('#myOwnedTeams').html(succ.data);
        })
        .catch((fail)=>{
            console.log(fail.data);
        });
        axios.get('/student/' + categoryId + '/teams')
            .then((succ) => {
                $('#myMemberTeams').html(succ.data);
            })
            .catch((fail) => {
                console.log(fail.data);
            });
    }
}