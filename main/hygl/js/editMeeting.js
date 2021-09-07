var editMeeting = function () {
    var bus = {
        isSeatSort:"false"
    };
     var isChryArr = [];
    var init = function () {
        loadEditMeetingData();
        loadMeetingRoom();
        isSeatSort();
        loadEmployeeName();
        editChry();
        date();
        time();
        editMeeting();
        selectZw();

        putExcTemplateUpload();
        delSeat();
        OnekeySort();
    };


    /**日期控件**/
    var date = function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            laydate.render({
                elem:'#date',
                type: 'date',
                done:function (value,date,endDate){
                    bus.dateTime = ''+date.year+'-'+(date.month<10?'0'+date.month:date.month)+'-'+(date.date<10?'0'+date.date:date.date);
                },
                btns:['confirm']
            });
        });
    };
    /**时间控件**/
    var time = function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            laydate.render({
                elem:'#time',
                type: 'time',
                range:'-',
                done:function (value,date,endDate){
                    var startTime = ''+(date.hours<10?'0'+date.hours:date.hours)+':'+(date.month<10?'0'+date.month:date.month);
                    var endTime = ''+(endDate.hours<10?'0'+endDate.hours:endDate.hours)+':'+(endDate.month<10?'0'+endDate.month:endDate.month);
                    bus.Time =startTime+'-'+endTime;
                },
                btns:['confirm']
            });
        });
    };
    /**加载会议室**/
    var loadMeetingRoom = function () {
        $.ajax({
            type:"post",
            url:"../../../queryMeetingRoom.action",
            data:{"id":"","device_id":"","roomName":"","roomeditr":"","roomStatus":"","offset":"","pageSize":""},
            dataType:"json",
            success:function (data) {

                if(data.status == '0'){


                    $(".js-editMeetingRoom").empty();
                    $(".js-editMeetingRoom").append('<li data-id="" >-请选择-</li>');
                    data.resp.data.forEach(function (item,index) {
                        $(".js-editMeetingRoom").append($('<li data-id="'+item.id+'">'+item.roomName+'</li>').data("sloutARR",item.slout));
                    });
                }else if(data.status == '-4'){
                    window.parent.location.href ='../../login/index.html';
                }
            },
            error:function () {
                console.error("Ajax请求失败!");
            }
        });
        // $(".js-editloadMeetingRoom").click(function (e) {
        //     e.stopPropagation();
        //     $(".js-editMeetingRoom").show();
        // });
        $("body").click(function () {
            $(".js-editMeetingRoom").hide();
        });
        //加载座椅布局
        $(".js-editMeetingRoom").delegate('li','click',function () {

            var id = $(this).attr("data-id");
            bus.meetingRoomId = id;
            var text = $(this).text();
            $(".js-editloadMeetingRoom").text(text);
            var meetingData = $(this).data("sloutARR");
            renderMeeting(meetingData);
        });
        $(".js-editMeetingRoom li[dara-id=40]").click();//会议室
        //
        $(".js-closeResultBox").click(function () {
            //window.close("setChry.html")
            parent.$(".js-iframe").attr("src","../hygl/index.html");
        });
    };
    function renderMeeting(meetingData,participants) {
        if(meetingData){bus.meetingRoomStatus = "true";}
        //$(".js-seatViewBox").show();
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
                div += ' <div class="zw js-selectZw js-setSeatNum js-setSelectZw onSelect" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatId = "seat'+(i+1)+(j+1)+'" data-seatStatus = "seat04"></div>';
            }
            var li = '<li>'+div+'</li>';
            $(".js-seatViewmain").append(li);
            var num = '<li>'+(i+1)+'</li>';
            $(".js-seatViewNumBox").append(num);
        }
        //渲染座椅状态

        meetingData.seatARR.forEach(function (item,index) {
            var meeting = {
                "seat01":"fydh",
                "seat02":"no",
                "seat03":"on",
                "seat04":"js-getSeatNum",
                "seat05":"gzx",
                "seat06":"gd",
                "seat07":"seat07"
            };
            $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass(meeting[item.seatStatus]);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatStatus",item.seatStatus);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatSite",item.seatSite);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatArea",item.seatArea);

        });
        //渲染座椅人员状态
        //读取人员
        var seatSiteObj = {
            "0":"左",
            "1":"中",
            "2":"右",
            "undefined":""
        };
        $(".js-editMeetingChryMenu").empty();

        if(participants){
            participants.forEach(function (item,index) {
            var tr = '<tr data-employeeId="'+item.employeeId+'" data-name="'+item.employeeName+'" data-company="'+item.company+'"  data-tips="'+item.Tips+'"  data-seatNum="'+item.seatNum+'"  data-seatId="'+item.seatId+'" data-seatsite="'+item.seatSite+'"  data-seatArea="'+item.seatArea+'"><td><img src="img/colse.png" class="closeChry-btn js-closeChryBtn"></td><td>'+item.employeeName+'</td><td>'+item.company+'</td><td>'+item.seatNum.replace("-","排")+"座"+'('+seatSiteObj[item.seatSite]+')</td></tr>';
            $(".js-editMeetingChryMenu").append(tr);
            isChryArr.push(item.employeeId);
            //渲染座椅状态
            var meeting = {
                "seat01":"fydh",
                "seat02":"no",
                "seat03":"on",
                "seat04":"js-getSeatNum",
                "seat05":"gzx",
                "seat06":"gd",
                "seat07":"seat07"
            };

            $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass("on");
            $(".js-selectZw[data-seatId='"+item.seatId+"']").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);' data-employeeId='"+item.employeeId+"'>"+item.employeeName+"</span>");
            $(".js-selectZw[data-seatId='"+item.seatId+"']").removeClass("onSelect");
        });
        }

    }
    //是否手动排序 自动排序
    var isSeatSort = function () {
        $("body").delegate('.js-seatSort','click',function () {
            var _this = $(this);
            var isSeatSort = $(this).attr("data-isSeatSort");

            bus.isSeatSort = isSeatSort;
            if(isSeatSort == "true"){//
                _this.addClass('on');
                _this.attr("data-isSeatSort","false");
                // _this.text("自动排序");
            }else{
                _this.removeClass('on');
                _this.attr("data-isSeatSort","true");
                //_this.text("手动排序");
            }
        });
    };
    /**选择座位**/
    var selectZw = function () {
        $("body").delegate('.js-getSeatNum.onSelect','click',function () {
            var type = $(this).attr("data-type");
            var keyWord = $(".js-editChryName").val();
            if(keyWord){
                if(type == "true"){
                    $(this).attr("data-type","false");
                    //$(".js-selectZw").removeClass('on');
                    //$(".js-getSeatNum.onSelect").empty();
                    //$(".js-getSeatNum.onSelect").removeClass('on');
                    $(".js-getSeatNum.onSelect").attr("data-type","true");
                    $(this).addClass('on');
                    $(this).append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);'  data-employeeId='"+bus.employeeId+"'>"+bus.employeeName+"</span>");
                    //获取座位号
                    var seatNum = $(this).attr("data-seatnum");
                    var seatId = $(this).attr("data-seatId");
                    var seatSite = $(this).attr("data-seatSite");
                    var seatArea = $(this).attr("data-seatArea");
                    bus.seatNum = seatNum;
                    bus.seatId = seatId;
                    bus.seatSite = seatSite;
                    bus.seatArea = seatArea;
                    //确定参会人员
                    var seatSiteObj = {
                        "0":"左",
                        "1":"中",
                        "2":"右",
                        "undefined":""
                    };
                    var employeeName = bus.employeeName;
                    var cmpany = bus.company;
                    var employeeId = bus.employeeId;
                    var Tips = $(".js-editChryTips").val();
                    if(employeeName && bus.seatNum){
                        isChryArr.push(employeeId);
                        $(".js-selectZw[data-seatNum='"+bus.seatNum+"']").removeClass("onSelect");
                        var tr = '<tr data-employeeId="'+employeeId+'" data-name="'+employeeName+'" data-company="'+cmpany+'"  data-tips="'+Tips+'"  data-seatNum="'+bus.seatNum+'"  data-seatId="'+bus.seatId+'"   data-seatSite="'+bus.seatSite+'" data-seatArea="'+bus.seatArea+'"><td><img src="img/colse.png" class="closeChry-btn js-closeChryBtn"></td><td>'+employeeName+'</td><td>'+cmpany+'</td><td>'+bus.seatNum.replace("-","排")+"座"+'('+seatSiteObj[bus.seatSite]+')</td></tr>';
                        $(".js-editMeetingChryMenu").append(tr);
                        bus.employeeName = "";
                        bus.company = "";
                        bus.employeeId = "";
                        bus.seatNum = "";
                        $(".js-editChryName").val("");
                        $(".js-editChryTips").val("");
                        // $(".js-setSeatNum ").removeClass('on')
                    }else{
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("参会人员姓名、座椅布局不得为空！",{icon:5});
                        });
                    }

                }
                // else{
                //     $(this).attr("data-type","true");
                //     $(this).removeClass('on');
                // }
            }else{
                layui.use(['layer'], function(){
                    var layer = layui.layer;
                    layer.msg("请先选择参会人员！",{icon:5});
                });
            }
        });
    };
    /**姓名模糊查询**/
    var loadEmployeeName = function () {
        var ryData = [];
        $.ajax({
            type:"post",
            url:"../../../queryEmployee.action",
            data:{"id":"","employeeName":"","department":"","employeePosition":"","employeeNo":"","phone":"","emaileditr":"","offset":"","pageSize":""},
            dataType:"json",
            success:function (data) {

                $(".js-allRYmenu").empty();
                ryData = data.resp.data;
                data.resp.data.forEach(function (item,index) {
                    $(".js-allRYmenu").append('<li data-lev="'+item.lev+'" data-department="'+item.department+'" data-company="'+item.company+'" data-employeeId="'+item.id+'">'+item.employeeName+'</li>');
                });
            },
            error:function () {
                console.error("Ajax请求失败!");
            }
        });
        $(".js-editChryName").bind("input propertvchange",function (e) {
            e.stopPropagation();
            var keyWord = $(this).val();
            var ry = ryData.filter(function (item) {
                if(item.employeeName.indexOf(keyWord) != -1){
                    return item;
                }
            });
            $(".js-allRY").show();
            $(".js-allRYmenu").empty();
            ry.forEach(function (item,index) {
                $(".js-allRYmenu").append('<li  data-lev="'+item.lev+'" data-department="'+item.department+'" data-company="'+item.company+'" data-employeeId="'+item.id+'">'+item.employeeName+'</li>');
            });
            if(!keyWord){
                bus.employeeName = "";
                bus.company = "";
                bus.employeeId = "";
                bus.department =  "";
                bus.lev =  "";
            }
        });
        //选择参会人员姓名
        $(".js-allRYmenu").delegate('li','click',function () {
            var employeeId = $(this).attr("data-employeeId");
            var isHasChry = isChryArr.filter(function (item) {
                if(item === employeeId){
                    return item;
                }
            });

            if(isHasChry.length == 0){
                bus.employeeName = $(this).text();
                bus.company = $(this).attr("data-company");
                bus.employeeId = $(this).attr("data-employeeId");
                bus.department =  $(this).attr("data-department");
                bus.lev =  $(this).attr("data-lev");
                $(".js-editChryName").val(bus.employeeName);
                $(".js-allRY").hide();
                if(bus.isSeatSort == "false"){//自动排序
                    //自动选择座位===============================
                    var getSeatNum = [];
                    $(".js-getSeatNum.onSelect").each(function (index,item) {
                        getSeatNum.push($(item).attr("data-seatnum"));
                    });

                    $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").addClass('on');
                    $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);' data-employeeId='"+bus.employeeId+"'>"+bus.employeeName+"</span>");
                    //确定参会人员===============
                    $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").attr("data-type","false");
                    //$(".js-selectZw").removeClass('on');
                    $(".js-getSeatNum.onSelect").empty();
                    $(".js-getSeatNum.onSelect").removeClass('on');
                    $(".js-getSeatNum.onSelect").attr("data-type","true");
                    $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").addClass('on');
                    $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);' data-employeeId='"+bus.employeeId+"'>"+bus.employeeName+"</span>");
                    //获取座位号
                    var seatNum = $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").attr("data-seatnum");
                    var seatId = $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").attr("data-seatId");
                    var seatSite = $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").attr("data-seatSite");
                    var seatArea = $(".js-getSeatNum.onSelect[data-seatnum="+getSeatNum[0]+"]").attr("data-seatArea");
                    bus.seatNum = seatNum;
                    bus.seatId = seatId;
                    bus.seatSite = seatSite;
                    bus.seatArea = seatArea;
                    //确定参会人员
                    var seatSiteObj = {
                        "0":"左",
                        "1":"中",
                        "2":"右",
                        "undefined":""
                    };

                    var employeeName = bus.employeeName;
                    var cmpany = bus.company;
                    var employeeId = bus.employeeId;
                    var Tips = $(".js-editChryTips").val();
                    var lev = bus.lev;
                    var department = bus.department;
                    if(employeeName && bus.seatNum){
                        isChryArr.push(employeeId);

                        $(".js-selectZw[data-seatNum='"+bus.seatNum+"']").removeClass("onSelect");
                        var tr = '<tr  data-lev="'+lev+'" data-department="'+department+'" data-employeeId="'+employeeId+'" data-name="'+employeeName+'" data-company="'+cmpany+'"  data-tips="'+Tips+'"  data-seatNum="'+bus.seatNum+'"  data-seatId="'+bus.seatId+'"   data-seatSite="'+bus.seatSite+'" data-seatArea="'+bus.seatArea+'" ><td><img src="img/colse.png" class="closeChry-btn js-closeChryBtn"></td><td>'+employeeName+'</td><td>'+cmpany+'</td><td>'+bus.seatNum.replace("-","排")+"座"+'('+seatSiteObj[bus.seatSite]+')</td></tr>';
                        $(".js-editMeetingChryMenu").append(tr);
                        bus.employeeName = "";
                        bus.company = "";
                        bus.employeeId = "";
                        bus.seatNum = "";
                        bus.department = "";
                        bus.lev = "";
                        $(".js-editChryName").val("");
                        //$(".js-addChryTips").val("");
                        // $(".js-setSeatNum ").removeClass('on')
                        getSeatNum.length = 0;
                    }
                }
            }else{
                $(".js-editChryName").val("");
                layui.use(['layer'], function(){
                    var layer = layui.layer;
                    layer.msg("已选择该人员！",{icon:5});
                });
            }

        });
        //取消
        $("body").click(function () {
            $(".js-allRY").hide();
        });
    };
    /**参会人员**/
    var editChry = function () {

        //删除参会人员
        $("body").delegate(".js-closeChryBtn","click",function () {
            $(this).parent().parent().remove();
            var seatNum = $(this).parent().parent().attr("data-seatNum");

            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").removeClass('on');
            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").empty();
            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").addClass("onSelect");
            var id = $(this).parent().parent().attr("data-employeeid");
            //删除已选人员数组id
            var index = isChryArr.indexOf(id);
            if(index > -1){
                isChryArr.splice(index,1)
            }
        });
    };

    /**修改会议**/
    var editMeeting = function () {
        $(".js-editMeeting").click(function () {
            var mTitle  = $(".js-editmTitle").val();
            var mTitleArr = mTitle.split("");
            var seTime = bus.dateTime +"#"+bus.Time;
            var meditr = bus.meetingRoomId;
            var participantsArr = [];
            $(".js-editMeetingChryMenu tr").each(function (index,item) {
                var participantsObj = {};
                participantsObj.employeeName = $(item).attr("data-name");
                participantsObj.employeeId = $(item).attr("data-employeeId");
                participantsObj.company =  $(item).attr("data-company");
                participantsObj.department = $(item).attr("data-department");
                participantsObj.lev =  $(item).attr("data-lev");
                participantsObj.tips =  $(item).attr("data-tips");
                participantsObj.seatNum =  $(item).attr("data-seatNum");
                participantsObj.seatId =  $(item).attr("data-seatId");
                participantsObj.seatNO =  $(item).attr("data-seatNum").replace("-","排")+"座";
                participantsObj.seatSite =  $(item).attr("data-seatSite");
                participantsObj.seatArea =  $(item).attr("data-seatArea");
                participantsArr.push(participantsObj);
            });
            var participants = JSON.stringify(participantsArr);

            //if(mTitleArr.length<=17){
                $.ajax({
                    type:"post",
                    url:"../../../updateMeeting.action",
                    data:{"id":bus.id,"m_title":mTitle,"m_editr":meditr,"seTime":seTime,"participants":participants,"status":"0"},
                    dataType:"json",
                        success:function (data) {

                        if(data.status == '0'){
                            layui.use(['layer'], function(){
                                var layer = layui.layer;
                                layer.msg("修改会议成功！",{icon:6});
                            });
                            $(".js-resultBox").hide();
                            $(".js-setSeatNum ").removeClass('on');
                            //window.opener.location.reload();
                            //window.close("setChry.html")
                            parent.$(".js-iframe").attr("src","../hygl/index.html");
                        }else if(data.status == '-4'){
                            window.parent.location.href ='../../login/index.html';
                        }
                    },
                    error:function () {
                        console.error("Ajax请求失败!");
                    }
                });
            // }else{
            //     layui.use(['layer'], function(){
            //         var layer = layui.layer;
            //         layer.msg("会议主题字数不能超过17位！",{icon:5});
            //     });
            // }
        });
    };
    //会议信息
    var loadEditMeetingData = function () {
        var editMeetingData = JSON.parse(sessionStorage.getItem('editMeetingData'))==null?[]:JSON.parse(sessionStorage.getItem('editMeetingData'));

        $(".js-editmTitle").val(editMeetingData.m_title);//会议主题
        $(".js-editloadMeetingRoom").text(editMeetingData.roomName);//会议室名称
        var seTimeArr = editMeetingData.seTime.split("#");
        $("#date").val(seTimeArr[0]);//日期
        $("#time").val(seTimeArr[1]);//时间
        bus.dateTime = seTimeArr[0];//日期
        bus.Time = seTimeArr[1];//时间
        renderMeeting(editMeetingData.seatlout,editMeetingData.participants);//渲染座椅布局
         bus.id = editMeetingData.id;

    };
    /**批量上传开会人员**/

    function putExcTemplateUpload() {
        layui.use('upload', function () {
            var upload = layui.upload;
            upload.render({ //允许上传的文件后缀
                elem: '#editPutExcTemplate',
                url: '../../../putExcTemplate.action',
                accept: 'file', //普通文件
                exts: 'xlsx|xls', //只允许上传xlsx文件
                before: function () {
                    layer.load(2);
                },
                done: function (data) {

                    if (data.status == '0') {
                        layui.use(['layer'], function () {
                            var layer = layui.layer;
                            layer.msg("批量上传开会人员成功！", {icon: 6});
                            layer.closeAll('loading');
                            //去除之前座椅布局情况
                            $(".js-getSeatNum.on").empty();
                            $(".js-getSeatNum.on").removeClass('on').addClass("onSelect");
                            $(".js-getSeatNum.on").attr("data-type","true");
                            $(".js-addMeetingChryMenu").empty();
                            //渲染座椅人员状态
                            //读取人员
                            var seatSiteObj = {
                                "0":"左",
                                "1":"中",
                                "2":"右",
                                "undefined":""
                            };
                            $(".js-editMeetingChryMenu").empty();
                            data.resp.data.userData.forEach(function (item,index) {
                                var seatArea = $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatArea");
                                var tr = '<tr data-employeeId="'+item.employeeId+'" data-name="'+item.employeeName+'" data-company="'+item.company+'"  data-tips="'+item.Tips+'"  data-seatNum="'+item.seatNum+'"  data-seatId="'+item.seatId+'" data-seatsite="'+item.seatSite+'" data-seatArea="'+seatArea+'"><td><img src="img/colse.png" class="closeChry-btn js-closeChryBtn"></td><td>'+item.employeeName+'</td><td>'+item.company+'</td><td>'+item.seatNum.replace("-","排")+"座"+'('+seatSiteObj[item.seatSite]+')</td></tr>';
                                $(".js-editMeetingChryMenu").append(tr);
                                isChryArr.push(item.employeeId);
                                //渲染座椅状态
                                var meeting = {
                                    "seat01":"fydh",
                                    "seat02":"no",
                                    "seat03":"on",
                                    "seat04":"js-getSeatNum",
                                    "seat05":"gzx",
                                    "seat06":"gd",
                                    "seat07":"seat07"
                                };

                                $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass("on");
                                $(".js-selectZw[data-seatId='"+item.seatId+"']").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);' data-employeeId='"+item.employeeId+"'>"+item.employeeName+"</span>");
                                $(".js-selectZw[data-seatId='"+item.seatId+"']").removeClass("onSelect");
                            });

                        });
                    } else if (data.status == '-4') {
                        window.parent.location.href = '../../login/index.html';
                    } else {
                        layui.use(['layer'], function () {
                            var layer = layui.layer;
                            layer.msg("批量上传开会人员失败！", {icon: 5});
                        });
                    }
                }
            });
        });
    }
    /**右键删除功能**/
    var delSeat = function(){
        var that;
        $("body").delegate(".js-selectZw.on","contextmenu",function (e) {
            that = $(this);
            e.stopPropagation();
            e.preventDefault();//取消该区域浏览器右键事件
            var id =  that.children("span").attr("data-employeeId");

            that.id = id;
            var scrollTop = $(window).scrollTop();
            $(".js-delSeat").show().css({"top":(e.clientY+scrollTop)+"px","left":(e.clientX+8)+"px"});
        });
        $("body").delegate(".js-delSeat","click",function () {
            var seatNum = that.attr("data-seatNum");


            $(".js-editMeetingChryMenu tr[data-seatNum='"+seatNum+"']").remove();
            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").removeClass('on');
            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").empty();
            $(".js-setSeatNum[data-seatNum='"+seatNum+"']").addClass("onSelect");

            //删除已选人员数组id
            var index = isChryArr.indexOf(that.id);
            if(index > -1){
                isChryArr.splice(index,1)
            }
            $(".js-delSeat").hide();
        });
    };
    /**一键重排座椅**/
    var OnekeySort = function(){
        $(".js-OnekeySort").click(function () {
            var OnekeySortArr = [];
            $(".js-editMeetingChryMenu tr").each(function (index,item) {
                var participantsObj = {};
                participantsObj.employeeName = $(item).attr("data-name");
                participantsObj.employeeId = $(item).attr("data-employeeId");
                participantsObj.company =  $(item).attr("data-company");
                participantsObj.department = $(item).attr("data-department");
                participantsObj.lev =  $(item).attr("data-lev");
                participantsObj.tips =  $(item).attr("data-tips");
                participantsObj.seatNum =  $(item).attr("data-seatNum");
                participantsObj.seatId =  $(item).attr("data-seatId");
                participantsObj.seatNO =  $(item).attr("data-seatNum").replace("-","排")+"座";
                participantsObj.seatSite =  $(item).attr("data-seatSite");
                OnekeySortArr.push(participantsObj);
            });

            if(OnekeySortArr.length != 0){
                //去除之前座椅布局情况
                $(".js-getSeatNum.on").empty();
                $(".js-getSeatNum.on").removeClass('on').addClass("onSelect");
                $(".js-getSeatNum.on").attr("data-type","true");
                $(".js-editMeetingChryMenu").empty();
                //自动选择座位===============================
                var OnekeySortgetSeatNum = [];
                OnekeySortArr.forEach(function (pItem,index) {
                    $(".js-getSeatNum").each(function (index,item) {
                        OnekeySortgetSeatNum.push($(item).attr("data-seatnum"));
                    });

                    $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").addClass('on');
                    $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);' data-employeeId='"+pItem.employeeId+"'>"+pItem.employeeName+"</span>");


                    //确定参会人员
                    var seatSiteObj = {
                        "0":"左",
                        "1":"中",
                        "2":"右",
                        "undefined":""
                    };
                    var employeeName = pItem.employeeName;
                    var cmpany = pItem.company;
                    var employeeId = pItem.employeeId;
                    var lev = pItem.lev;
                    var department = pItem.department;
                    var Tips = pItem.tips;
                    var seatNum = $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").attr("data-seatNum");
                    var seatSite =  $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").attr("data-seatSite");
                    var seatArea =  $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").attr("data-seatArea");
                    var seatId = $(".js-getSeatNum.onSelect[data-seatnum="+OnekeySortgetSeatNum[index]+"]").attr("data-seatId");

                    $(".js-selectZw[data-seatNum='"+seatNum+"']").removeClass("onSelect");
                    var tr = '<tr data-lev="'+lev+'" data-department="'+department+'" data-employeeId="'+employeeId+'" data-name="'+employeeName+'" data-company="'+cmpany+'"  data-tips="'+Tips+'"  data-seatNum="'+seatNum+'"  data-seatId="'+seatId+'"   data-seatSite="'+seatSite+'" data-seatArea="'+seatArea+'"><td><img src="img/colse.png" class="closeChry-btn js-closeChryBtn"></td><td>'+employeeName+'</td><td>'+cmpany+'</td><td>'+seatNum.replace("-","排")+"座"+'('+seatSiteObj[seatSite]+')</td></tr>';
                    $(".js-editMeetingChryMenu").append(tr);
                    OnekeySortgetSeatNum.length = 0;






                });
            }else{
                layui.use(['layer'], function () {
                    var layer = layui.layer;
                    layer.msg("请确定是否存在参会人员！", {icon: 5});
                });
            }


        });
    }

    return {
        init:init
    }
}();
