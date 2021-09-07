var addHys = function () {

    var seatBus = {
        colNum:"",
        rowNum:"",
        rostrumcolNum:"",
        rostrumrowNum:"",
        seatARR:[],
        deviceIdArr:[],
        className:""
    };
    var init = function () {
        getDevice();
        hysAddConfirm();
        zwRightKey();
        canvasZy();
        canvasrostrumZy();
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
            var text = $(this).text();

            if(seatBus.deviceIdArr.length == 0){
                $(".js-deviceIdText").empty();
            }
            $(".js-deviceIdText").append(text+',');
            seatBus.deviceIdArr.push(id);

        });
    };
    //根据行列布局座椅
    var canvasZy = function () {
        $(".js-canvasBj").click(function () {
            $(".js-zwBox").empty();
            $(".js-zwNumBox").empty();
            var colNum = $(".js-colNum").val();//行数
            var rowNum = $(".js-rowNum").val();//列数
            seatBus.colNum = colNum;
            seatBus.rowNum = rowNum;
            if(colNum<=40 && rowNum<=80){
                for (var i = 0; i < parseInt(colNum)+1 ; i++) {
                    var div = "";
                    for (var j = 0; j < parseInt(rowNum)+1 ; j++) {
                        div += ' <div class="zw js-selectZw js-setSeatNum js-setSelectZw" data-className="false" data-type="true" data-seatNum = "'+(i)+'"  data-rowNum = "'+(j)+'" data-colNum = "'+(i)+'"  data-seatId = "seat'+(i)+"-"+(j)+'" data-seatStatus = "seat04" data-seatIndex="'+(j)+'" data-seatSite=""></div>';
                    }
                    var li = '<li>'+div+'</li>';
                    $(".js-zwBox").append(li);
                    var num = '<li>'+(i)+'</li>';
                    $(".js-zwNumBox").append(num);
                }
                //设置还原按钮
                $(".js-selectZw[data-rowNum=0]").removeClass("zw").addClass("closeBtn");
                $(".js-selectZw[data-colNum=0]").removeClass("zw").addClass("closeBtn");
                //还原行列按钮
                $(".js-selectZw.closeBtn").click(function(){

                    var closeColNum = $(this).attr("data-colNum");
                    var closeRowNum = $(this).attr("data-rowNum");
                    if(closeColNum == 0){
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").removeClass("seat07");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").removeClass("fydh");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").removeClass("gzx");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").removeClass("js-setSeatNum");
                        //批量设置过道
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").addClass("js-cx");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").addClass("cx");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").addClass("gd");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").attr("data-seatStatus","seat06");
                        $(".js-selectZw[data-rowNum="+closeRowNum+"]").attr("data-className","gd");

                    }
                });
            }else{
                layui.use(['laypage', 'layer'], function(){
                    var laypage = layui.laypage,
                        layer = layui.layer;
                    layer.msg("行列数超出限额");
                });
            }
        });
    };
    //座椅右键选择过道
    var zwRightKey = function () {
        var that;
        $("body").delegate(".js-selectZw","contextmenu",function (e) {
            e.stopPropagation();
            e.preventDefault();//取消该区域浏览器右键事件
            that = $(this);
            var className = that.attr("data-className");
            var scrollTop = $(window).scrollTop();
            $(".js-rightKey").show().css({"top":(e.clientY+scrollTop)+"px","left":e.clientX+"px"});

        });
        $("body").click(function () {
            $(".js-rightKey").hide();
        });
        $(".js-rightKey li").click(function () {
            var type = $(this).attr("data-type");

            that.removeClass("gzx").removeClass("gd").removeClass("fydh");
            that.addClass(type).addClass("js-cx");
            that.attr("data-className",type);
            that.removeClass("js-setSeatNum");
            if(type == "fydh"){
                that.attr("data-seatStatus","seat01");
                that.addClass("js-setSeatNum");
            }else if(type == "gzx"){
                that.attr("data-seatStatus","seat05");
                that.addClass("js-setSeatNum");
            }else if(type == "gd"){
                that.attr("data-seatStatus","seat06");
            }else if(type == "seat07"){
                that.attr("data-seatStatus","seat07");
            }
        });
        //撤销
        var _this;
        $("body").delegate(".js-cx","contextmenu",function (e) {
            e.stopPropagation();
            e.preventDefault();//取消该区域浏览器右键事件
            _this = $(this);
            var className = _this.attr("data-className");
            seatBus.className = className;

            var scrollTop = $(window).scrollTop();
            $(".js-rightKey").show().css({"top":e.clientY+scrollTop+"px","left":e.clientX+"px"});
            $(".js-zxli").show();
        });
        $(".js-zxli").click(function () {
            var className = _this.attr("data-className");

            _this.removeClass(seatBus.className).removeClass("js-cx");
            $(this).css({"display":"none"});
            _this.attr("data-className","false");
            _this.addClass("js-setSeatNum");
            _this.attr("data-seatStatus","seat04");
        });

    };
    //主席台
    //根据行列布局座椅
    var canvasrostrumZy = function () {
        $(".js-rostrumcanvasBj").click(function () {
            $(".js-rostrumzwBox").empty();
            $(".js-rostrumzwNumBox").empty();
            var colNum = $(".js-rostrumcolNum").val();//行数
            var rowNum = $(".js-rostrumrowNum").val();//列数
            // seatBus.colNum = colNum;
            // seatBus.rowNum = rowNum;
            if(colNum<=40 && rowNum<=80){
                for (var i = 0; i < colNum ; i++) {
                    var div = "";
                    for (var j = 0; j < rowNum ; j++) {
                        div += ' <div class="zw js-rostrumSelectZw js-rostrumSetSeatNum js-rostrumSetSelectZw no" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatStatus = "seat04"></div>';
                    }
                    var li = '<li>'+div+'</li>';
                    $(".js-rostrumzwBox").append(li);
                    var num = '<li>'+(i+1)+'</li>';
                    //$(".js-rostrumzwNumBox").append(num);
                }
            }else{
                layui.use(['laypage', 'layer'], function(){
                    var laypage = layui.laypage,
                        layer = layui.layer;
                    layer.msg("行列数超出限额");
                });
            }
        });
    };
    //新建会议室确定
    var hysAddConfirm = function () {
        $('.js-hysAddConfirm').click(function () {
            seatBus.seatARR.length = 0;
            //设置座位号
            for(var i = 0;i<=seatBus.colNum;i++){
                $(".js-setSeatNum[data-colnum='"+i+"']").each(function (index,item) {
                    var _that = $(this);
                    var num = _that.attr("data-colNum");
                    _that.attr("data-seatNum",num+"-"+(index));
                });
            }
            //获取左中右的过道
            var seatIndexArr = [];
            $(".js-setSelectZw").each(function (index,item) {
                var _that = $(item);
                if(_that.hasClass('gd')){
                    var seatIndex = _that.attr("data-seatIndex");

                    seatIndexArr.push(seatIndex);

                }
            });

            var seatIndexArrNew=[];
            for(var i=0;i<seatIndexArr.length;i++) {
                var items=seatIndexArr[i];
                //判断元素是否存在于new_arr中，如果不存在则插入到new_ar中
                if($.inArray(items,seatIndexArrNew)==-1) {
                    seatIndexArrNew.push(items);
                }
            }

            //获取座位号以及座椅转态
            var seatDataArr = [];
            seatDataArr.length = 0;
            $(".js-setSelectZw").each(function (index,item) {
                var _that = $(item);
                //设置左中右
                var seatIndex = parseInt(_that.attr("data-seatIndex"));
                // if(seatIndex < parseInt(seatIndexArrNew[0])){
                //     _that.attr("data-seatSite","0");
                // }else if(seatIndex >= parseInt(seatIndexArrNew[0]) && seatIndex < parseInt(seatIndexArrNew[1])){
                //     _that.attr("data-seatSite","1")
                // }else if(seatIndex >= parseInt(seatIndexArrNew[1])){
                //     _that.attr("data-seatSite","2")
                // }
                if(seatIndex < parseInt(seatIndexArrNew[0])){
                    _that.attr("data-seatSite","0");
                }else if(seatIndex >= parseInt(seatIndexArrNew[seatIndexArrNew.length - 1])){
                    _that.attr("data-seatSite","2")
                }else{
                    _that.attr("data-seatSite","1");
                }

                //组装座椅布局状态数据
                var seatStatus = _that.attr("data-seatStatus");
                var seatNum = _that.attr("data-seatNum");
                var seatId = _that.attr("data-seatId");
                var seatSite = _that.attr("data-seatSite");
                var seatObj = {};
                seatObj.seatStatus = seatStatus;
                seatObj.seatNum = seatNum;
                seatObj.seatId = seatId;
                seatObj.seatSite = seatSite;
                seatDataArr.push(seatObj);
            });

            seatBus.seatARR = seatDataArr;

            //获取会议室参数
            var roomName = $(".js-roomName").val();
            var roomAddr = $(".js-roomAddr").val();
            //获取设备id
            var deviceId = "";
            seatBus.deviceIdArr.forEach(function (item,index) {
                deviceId += item+','
            });



            var rostrumcolNum = $(".js-rostrumcolNum").val();
            var rostrumrowNum = $(".js-rostrumrowNum").val();
            seatBus.rostrumcolNum = rostrumcolNum;
            seatBus.rostrumrowNum = rostrumrowNum;

            var slout = JSON.stringify(seatBus);
            if(roomName && deviceId != 0){
                $.ajax({
                    type:"post",
                    url:"../../../addMeetingRoom.action",
                    data:{"roomName":roomName,"roomAddr":roomAddr,"deviceId":deviceId,"slout":slout,"roomType":"0"},
                    dataType:"json",
                    success:function (data) {

                        if(data.status == '0'){


                            seatDataArr.length=0;
                            seatBus.seatARR.length=0;
                            layui.use(['layer'], function(){
                                var layer = layui.layer;
                                layer.msg("新建会议室成功！",{icon:6});
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
                                layer.msg("新建会议室失败！",{icon:5});
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
