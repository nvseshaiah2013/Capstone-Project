$(document).ready(function () {
    $('.ui.form').form({
        on: 'blur',
        inline: true,
        fields: {
            username: {
                identifier: 'username',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'fill the required fields'
                    },
                    {
                        type: 'email',
                        prompt: 'enter a valid username'
                    }
                ]
            },
            password: {
                identifier: 'password',
                rules: [
                    {
                        type: 'empty',
                        prompt: 'password is required'
                    }
                ]
            }
        }
    });
})