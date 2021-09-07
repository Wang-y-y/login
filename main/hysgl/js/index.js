var main = function () {

    var bus = {
        offset:"1"
    };
    var init = function () {
        setPageSize();
        addHysResult();

        loadQueryData("","","","","",bus.offset,bus.pageSize);



        seatView();
        deleteMeetingRoom();
        ExportExcel();
        editDevice();
    };
    function covernString(obj){
        if(obj==null||obj=='null'||obj==undefined||obj=='undefined'||obj==''){
            return '';
        }else{
            return obj;
        }
    }
    function setPageSize() {
        $(".js-zwBox").empty();
        $(".js-zwNumBox").empty();
        var height = $(".js-meetingRoomMain").height();
        var pagesize = parseInt(height/41)-1;//每页显示条数
        bus.pageSize = pagesize;
    }
    /**分页**/
    var page = function (offset,count) {
        layui.use(['laypage', 'layer'], function(){
            var laypage = layui.laypage,
                layer = layui.layer;
            //总页数大于页码总数
            laypage.render({
                elem: 'page',
                first: '首页',
                last: '尾页',
                curr:offset,
                count: count, //数据总数
                limit:bus.pageSize,
                theme:'#247BD5',
                jump: function(obj,first){
                    bus.offset = obj.curr;
                    if(!first){
                        loadQueryData("","","","","",bus.offset,bus.pageSize);
                    }
                }
            });
        });
    };


    //添加弹出框
    function addHysResult() {
        $(".js-addHysResult").click(function () {
           // window.open("addHys.html");
            parent.$(".js-iframe").attr("src","../hysgl/addHys.html");
        });

        //一键生成回型会议室
        $(".js-AkeySet").click(function () {
            // window.open("addHys.html");
            parent.$(".js-iframe").attr("src","../hysgl/AkeySet.html");
        });
    }


    /**查询会议室列表**/
    var loadQueryData = function (id,deviceId,roomName,roomAddr,roomStatus,offset,pageSize) {

        $.ajax({
            type:"post",
            url:"../../../queryMeetingRoom.action",
            data:{"id":id,"device_id":deviceId,"roomName":roomName,"roomAddr":roomAddr,"roomStatus":roomStatus,"offset":offset,"pageSize":pageSize},
            dataType:"json",
            success:function (data) {

                if(data.status == '0'){
                	bus.dataLength = data.resp.data.length;
                    renderQueryData(data.resp.data);//渲染查询出的数据
                    page(offset,data.resp.total);//渲染查询出的数据分页
                }else if(data.status == '-4'){
                    window.parent.location.href ='../../login/index.html';
                }
            },
            error:function () {
                console.error("Ajax请求失败!");
            }
        });
    };
    /**渲染查询出的数据**/
    function renderQueryData(data) {
        $(".js-meetingRoomTableBox").empty();
        if(data){
           data.forEach(function (item,index) {
                var num = index + 1;
                var status = {
                    "0":"空闲",
                    "1":"使用中"
                };
                var device_name = "";
                item.deviceArr.forEach(function (subItem,index) {
                    device_name+= subItem.device_name+' , ';
                });
                var tr = $('<tr>\n' +
                                '<td>'+num+'</td>\n' +
                                '<td>'+covernString(item.roomName)+'</td>\n' +
                                '<td>'+covernString(item.roomAddr)+'</td>\n' +
                                '<td>'+status[item.roomStatus]+'</td>\n' +
                                '<td>'+device_name+'</td>\n' +

                    '<td>\n' +
                    '    <div class="result-btn fl js-editDeviceBtn" >修改</div>\n' +
                    '    <div class="result-btn fl js-seatViewBtn" >查看</div>\n' +
                    '    <div class="result-btn fl js-ExportExcel" data-id="'+item.id+'" >导出</div>\n' +
                    '    <div class="result-btn fl js-deleteMeetingRoom" data-id="'+item.id+'" >删除</div>\n' +
                    '</td>\n' +
                            '</tr>').data("meetingData",item);
                $(".js-meetingRoomTableBox").append(tr);
            });
        }

    }

    //查看座椅布局
    var seatView = function () {
        $("body").delegate(".js-seatViewBtn","click",function () {
            var meetingData = $(this).parent().parent().data("meetingData").slout;

            sessionStorage.setItem('meetingData',JSON.stringify(meetingData));
            //window.open("setSeat.html");
            parent.$(".js-iframe").attr("src","../hysgl/setSeat.html");
            // $(".js-seatViewBox").show();

        });

    };
    /**删除会议室**/
    var deleteMeetingRoom = function () {
        $("body").delegate(".js-deleteMeetingRoom","click",function () {
            var id = $(this).attr("data-id");
            var offset;
            if(bus.dataLength == 1){
                offset = bus.offset - 1;
            }else{
                offset = bus.offset
            }
            if(offset == "0"){
                bus.offset = 1;
            }else{
                bus.offset = offset;
            }
            layui.use(['layer'], function(){
                var layer = layui.layer;
                layer.msg("确定删除此会议室吗?",{
                    icon:5,
                    time:0,
                    area:'400px',
                    btn: ['确定', '取消'],
                    yes:function (index) {
                        $.ajax({
                            type:"post",
                            url:"../../../delMeetingRoom.action",
                            data:{"id":id},
                            dataType:"json",
                            success:function (data) {
                                if(data.status == '0'){
                                    layui.use(['layer'], function(){
                                        var layer = layui.layer;
                                        layer.msg("删除会议室成功！");
                                    });
                                    layer.close(index);
                                    loadQueryData("","","","","",bus.offset,bus.pageSize);
                                }else if(data.status == '-4'){
                                    window.parent.location.href ='../../login/index.html';
                                }else{
                                    layui.use(['layer'], function(){
                                        var layer = layui.layer;
                                        layer.msg(data.resp);
                                    });
                                }
                            },
                            error:function () {
                                console.error("Ajax请求失败!");
                            }
                        });
                    },
                    no:function (index) {
                        layer.close(index);
                    }
                })
            });
        });
    };
    //导出座椅布局Excel
    var ExportExcel = function () {
        $("body").delegate(".js-ExportExcel","click",function () {
            var id = $(this).attr("data-id");
            $.ajax({
                type:"post",
                url:"../../../exportRoomExcel.action",
                data:{"id":id},
                dataType:"json",
                success:function (data) {
                    console.log(data);
                    if(data.status == '0'){
                        window.location.href="../../../"+data.resp.url;
                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }else{
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg(data.resp);
                        });
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });
    };
    //修改会议室多设备
    function editDevice() {
        $("body").delegate(".js-editDeviceBtn","click",function () {
            var editDeviceData = $(this).parent().parent().data("meetingData");

            sessionStorage.setItem('editDeviceData',JSON.stringify(editDeviceData));
            //window.open("setSeat.html");
            parent.$(".js-iframe").attr("src","../hysgl/editDevice.html");
            // $(".js-seatViewBox").show();

        });
    }

    return {
        init:init
    };
}();
