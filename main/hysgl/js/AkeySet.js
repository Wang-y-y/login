var setChrySeat = function () {
    var bus = {
       deviceIdArr:[]
    }
;    var seatBus = { };
    var init = function () {
        getDevice();
        meetingTemplate();
        hysAddConfirm();
    };
    //读取设备
    var getDevice = function () {
        //关闭
        $(".js-closeResultBtn").click(function () {
            //window.close("addHys.html");
            parent.$(".js-iframe").attr("src","../hysgl/index.html");
        });
        // 关闭
        $(".js-closeSeatViewBox").click(function () {
            // $(".js-seatViewBox").hide();
            var data = [];
            sessionStorage.setItem('meetingDataView',JSON.stringify(data));
            sessionStorage.setItem('participantsData',JSON.stringify(data));
            //window.close("setChrySeat.html");
            parent.$(".js-iframe").attr("src","../hysgl/index.html");
            $(".js-seatViewNumBox").empty();
            $(".js-seatViewmain").empty();
        });
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
            var text = $(this).text();

            if(bus.deviceIdArr.length == 0){
                $(".js-deviceIdText").empty();
            }
            $(".js-deviceIdText").append(text+',');
            bus.deviceIdArr.push(id);

        });
    };
    //选择模板
    var meetingTemplate = function () {
        $(".js-meetingTemplate li").click(function () {
            $(this).addClass('on').siblings().removeClass("on");
            var jsonUrl = $(this).attr("data-json");

            setChrySeatView(jsonUrl);
        });

    };

    //渲染回型座椅排布
    var setChrySeatView = function (jsonUrl) {
        $.getJSON("json/"+jsonUrl+".json",function (meetingData) {
            console.log(meetingData);
            seatBus = meetingData;

        //渲染主席团座椅
        //$(".js-rostrumzwBox").empty();
        $(".js-rostrumzwBox").empty();
        for (var i = 0; i < meetingData.rostrumcolNum ; i++) {
            var div = "";
            for (var j = 0; j < meetingData.rostrumrowNum ; j++) {
                div += ' <div class="zw js-rostrumSelectZw js-rostrumSetSeatNum js-rostrumSetSelectZw no" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatStatus = "seat04"></div>';
            }
            var li = '<li>'+div+'</li>';
            $(".js-rostrumzwBox").append(li);
            var num = '<li>'+(i+1)+'</li>';
            //$(".js-rostrumzwNumBox").append("");
        }

        //渲染座椅布局
        $(".js-seatViewNumBox").empty();
        $(".js-seatViewmain").empty();
        for (var i = 0; i < meetingData.colNum ; i++) {
            var div = "";
            for (var j = 0; j < meetingData.rowNum ; j++) {
                div += ' <div class="zw js-selectZw js-setSeatNum" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatId = "seat'+(i+1)+(j+1)+'" data-seatStatus = "seat04" data-seatArea="" title=""></div>';
            }
            var li = '<li>'+div+'</li>';
            $(".js-seatViewmain").append(li);
            var num = '<li>'+(i+1)+'</li>';
            $(".js-seatViewNumBox").append(num);
        }
        //渲染座椅状态
            console.log(meetingData.seatARR);
            meetingData.seatARR.forEach(function (item,index) {

            var meeting = {
                "seat01":"fydh",
                "seat02":"no",
                "seat03":"on",
                "seat05":"gzx",
                "seat06":"gd",
                "seat07":"seat07"
            };
            $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass(meeting[item.seatStatus]);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatStatus",item.seatStatus);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatArea",item.seatArea);

        });
        // participantsData.forEach(function (item,index) {
        //     $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass("on");
        //     $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatStatus","seat03");
        //     $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);
        //     var seatNUM = item.seatNum.replace("-","排");
        //     $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("title",item.employeeName+";"+seatNUM+"座")
        //     $(".js-selectZw[data-seatId='"+item.seatId+"']").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);'>"+item.employeeName+"</span>");
        // });



        });
    };
    //新建会议室确定
    var hysAddConfirm = function () {
        $('.js-hysAddConfirm').click(function () {





            //获取会议室参数
            var roomName = $(".js-roomName").val();
            var roomAddr = $(".js-roomAddr").val();
            //获取设备id
            var deviceId = "";
            bus.deviceIdArr.forEach(function (item,index) {
                deviceId += item+','
            });
            //主席台默认为0


            var slout = JSON.stringify(seatBus);
            if(roomName && deviceId != 0){
                $.ajax({
                    type:"post",
                    url:"../../../addMeetingRoom.action",
                    data:{"roomName":roomName,"roomAddr":roomAddr,"deviceId":deviceId,"slout":slout,"roomType":"1"},
                    dataType:"json",
                    success:function (data) {

                        if(data.status == '0'){



                            seatBus.seatARR.length=0;
                            layui.use(['layer'], function(){
                                var layer = layui.layer;
                                layer.msg("新建回型会议室成功！",{icon:6});
                                //window.opener.location.reload();
                                //window.close("addHys.html");
                                //loadQueryData("","","","","",bus.offset,bus.pageSize);

                               parent.$(".js-iframe").attr("src","../hysgl/index.html");
                            });
                            $(".js-resultBox").hide();
                            //parent.bus.offset = "1";
                        }else if(data.status == '-4'){
                            window.parent.location.href ='../../login/index.html';
                        }else{
                            layui.use(['layer'], function(){
                                var layer = layui.layer;
                                layer.msg("新建回型会议室失败！",{icon:5});
                            });
                        }
                    },
                    error:function () {
                        console.error("Ajax请求失败!");
                    }
                });
            }else{
                layui.use(['layer'], function(){
                    var layer = layui.layer;
                    layer.msg("会议室名称与设备编号不可为空！",{icon:2});
                });
            }

        });

    };
    return {
        init:init
    }
}();
