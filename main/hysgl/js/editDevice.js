var editDeviceMain = function () {
    var editBus = {
        deviceIdArr: []
    };
    var init = function () {
        getDevice();
        editDeviceAll();
    };
   //读取设备
    var getDevice = function () {
        $.ajax({
            type:"post",
            url:"../../../queryDevice.action",
            data:{"id":"","device_name":"","device_code":"","device_ip":"","device_addr":"","status":"","offset":"","pageSize":""},
            dataType:"json",
            success:function (data) {

                $(".js-deviceId").empty();
                if(data.status == '0'){
                    // $(".js-deviceId").append('<li data-id=" ">-请选择-</li>');
                    data.resp.data.forEach(function (item,index) {
                        var li = '<li data-id="'+item.id+'">'+item.device_name+'</li>';
                        $(".js-deviceId").append(li);
                    });

                }else if(data.status == '-4'){
                    window.parent.location.href ='../../login/index.html';
                }
            },
            error:function () {
                console.error("Ajax请求失败!");
            }
        });
        //加载设备
        $(".js-deviceIdText").click(function (e) {
            e.stopPropagation();
            $(".js-deviceId").show();
        });
        $("body").click(function () {
            $(".js-deviceId").hide();
        });
        //选择设备id
        $(".js-deviceId").delegate(' li','click',function () {
            var id = $(this).attr("data-id");
            var device_name = $(this).text();
            var deviceIdArr = [];

            $(".js-editDeviceMain .js-editDevice").each(function (index,item) {

                var id = $(item).attr("data-id");

                deviceIdArr.push(id);
            });

            var isDeviceId = false;
            for(var i = 0;i<deviceIdArr.length;i++){
                if(parseInt(id) == parseInt(deviceIdArr[i])){
                    isDeviceId = true;
                    break;
                }
            }

            if(isDeviceId == false){
                var editDevice = '<div class="editDevice js-editDevice" data-id="'+id+'">'+device_name+' <div class="editDeviceClose js-editDeviceClose">×</div></div>';
                $(".js-editDeviceMain").append(editDevice);
            }else{
                layui.use(['layer'], function(){
                    var layer = layui.layer;
                    layer.msg("已有该设备！",{icon:5});
                });
            }

        });
    };
    //修改多设备提交
    var editDeviceAll = function () {
        var editDeviceData = JSON.parse(sessionStorage.getItem('editDeviceData'))==null?[]:JSON.parse(sessionStorage.getItem('editDeviceData'));

        $(".js-roomName").text(editDeviceData.roomName);
        $(".js-roomAddr").text(editDeviceData.roomAddr);
        //渲染已有设备
        $(".js-editDeviceMain").empty();
        editDeviceData.deviceArr.forEach(function(item,index){
            editBus.deviceIdArr.push(item.id);
            var editDevice = '<div class="editDevice js-editDevice" data-id="'+item.id+'">'+item.device_name+' <div class="editDeviceClose js-editDeviceClose">×</div></div>';
            $(".js-editDeviceMain").append(editDevice);
        });
        //删除
        $(".js-editDeviceMain").delegate(".js-editDevice","mouseenter",function () {
           $(this).find(".js-editDeviceClose").show();
        });
        $(".js-editDeviceMain").delegate(".js-editDevice","mouseleave",function () {
            $(this).find(".js-editDeviceClose").hide();
        });
        $(".js-editDeviceMain").delegate(".js-editDeviceClose","click",function () {
           $(this).parent().remove();


        });
        //确定提交
        $(".js-deviceAddConfirm").click(function () {
            var deviceId = "";
            $(".js-editDeviceMain .js-editDevice").each(function (index,item) {

                var id = $(item).attr("data-id");
                deviceId+=id+','
            });
            $.ajax({
                type:"post",
                url:"../../../updateMeetingRoom.action",
                data:{"id":editDeviceData.id,"roomName":editDeviceData.roomName,"roomAddr":editDeviceData.roomAddr,"deviceId":deviceId,"slout":editDeviceData.slout,"roomStatus":editDeviceData.roomStatus,"rostrum":editDeviceData.rostrum},
                dataType:"json",
                success:function (data) {

                    if(data.status == '0'){



                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("修改会议室设备成功！",{icon:6});
                            //window.opener.location.reload();
                            //window.close("addHys.html");
                            //loadQueryData("","","","","",bus.offset,bus.pageSize);
                            setTimeout(function () {

                                parent.$(".js-iframe").attr("src","../hysgl/index.html");
                            },500);
                        });
                        $(".js-resultBox").hide();
                        //parent.bus.offset = "1";
                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }else{
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("修改会议室设备失败！",{icon:5});
                        });
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });

        //关闭
        $(".js-closeResultBtn").click(function () {
            //window.close("addHys.html");
            parent.$(".js-iframe").attr("src","../hysgl/index.html");
        });
    };

    return {
        init:init
    }
}();
