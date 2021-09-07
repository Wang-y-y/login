var main = function () {
    var init = function () {
        menuTab();
        userLogout();
        meetting();
        setInterval(function () {
           // meetting();
        },1000)
    };
    //切换大厅
    var menuTab = function () {
        $(".js-menuBox .js-menu").click(function () {
            $(this).addClass('on').siblings().removeClass('on');
            var url = $(this).attr("data-url");
            $(".js-iframe").attr("src",url);
        });
    };
    //注销
    function userLogout(){
        $(".js-userLogout").click(function () {
            // $.ajax({
            //     url: '../../../userLogout.action',
            //     type: 'post',
            //     dataType: 'json',
            //     data: {},
            //     success: function (msg) {
            //         if(msg.status == "0"){
            //             window.location.href='../../login/index.html';
            //         }
            //     }
            // })
            window.location.href='../../../login/index.html';
        });
    }
    //已到会
    var meetting = function () {
        $.ajax({
            type:"post",
            url:"../../../queryMeetingStatusToday.action",
            // data:{"id":id},
            dataType:"json",
            success:function (data) {

                if(data.status == '0'){
                    $(".js-todayCount").text(data.resp.todayCount);
                    $(".js-overCount").text(data.resp.overCount);
                    $(".js-meetingCount").text(data.resp.meetingCount);

                }else if(data.status == '-4'){
                    window.parent.location.href ='../../login/index.html';
                }else{
                    layer.msg(data.resp,{icon:5});

                }

            },
            error:function () {
                console.error("Ajax请求失败!");
            }
        });
    };

    return {
        init:init
    }
}();
