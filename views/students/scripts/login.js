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
                        prompt: 'Invalid Field'
                    },
                    {
                        type: 'email',
                        prompt: 'Invalid Field'
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