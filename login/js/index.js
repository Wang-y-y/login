var login = function () {
    var init = function (){
        login();
    };
    /**登录**/
    var login = function () {
        $('body').delegate('.js-login', 'click', function () {
            var username = $('input[name=username]').val();
            var password = $('input[name=password]').val();
            console.log(username,password);
            if(username == 'admin' && password == '123456'){
                window.location.href='../main/index/index.html';
            }
            // $.ajax({
            //     url: '../../userLogin.action',
            //     type: 'post',
            //     dataType: 'json',
            //     data: {userName:username, password:password},
            //     success: function (msg) {
            //         console.log(msg);console.log(msg.status);
            //         $('input[name=username],input[name=password]').parents('.js-content-field-box').removeClass('content-field-box-error');
            //
            //         if(msg.status == "0"){
            //            console.log(222);
            //            window.location.href='../main/index/index.html';
            //         }else if(msg.status == '-4'){
            //             window.parent.location.href ='../../login/index.html';
            //         }else{
            //             $('input[name=username]').parents('.js-content-field-box').addClass('content-field-box-error');
            //             $('input[name=password]').parents('.js-content-field-box').addClass('content-field-box-error');
            //             layui.use(['layer'], function(){
            //                 var layer = layui.layer;
            //                 layer.msg(msg.resp,{icon:5});
            //             });
            //         }
            //     }
            // })
        });

        $(window).keydown(function (event) {
            switch (event.keyCode) {
                case 13:
                    $('.js-login').click();
                    break;
                case 27:

                    break;
            }
        });
    };

    return {
        init:init
    }
}();
