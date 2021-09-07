var main = function () {
    var time;
    var bus = {
        offset:"1"
    };
    var isChryArr = [];
    var initMeetingData;//发送会议返回数值
    var init = function () {
        setPageSize();
        loadQueryData("","","","",bus.offset,bus.pageSize);

        addMeetingHtml();
        //loadMeetingRoom();
        deleteMeeting();
        initMeeting();
        seatView();
        endMeeting();
        printMeetingSignInfo();
        time = setInterval(function () {
            loadQueryData("","","","",bus.offset,bus.pageSize);
        },6000);
//        clearInterval(time )
        resendMeeting();
        addBatchEmployee();
        editMeeting();
        getBigImg();
    };
    function covernString(obj){
        if(obj==null||obj=='null'||obj==undefined||obj=='undefined'||obj==''){
            return '';
        }else{
            return obj;
        }
    }

    function setPageSize() {
        var height = $(".js-meetingMain").height();
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
                        loadQueryData("","","","",bus.offset,bus.pageSize);
                    }
                }
            });
        });
    };

    /**查询会议列表**/
    var loadQueryData = function (id,mTitle,mAddr,status,offset,pageSize) {

        $.ajax({
            type:"post",
            url:"../../../queryMeeting.action",
            data:{"id":id,"m_title":mTitle,"m_addr":mAddr,"status":status,"offset":offset,"pageSize":pageSize},
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
    function imgerrorfun(url) {
        console.log(url);
        if(isNaN(url)||url=='0'){
            var img = event.srcElement;
            img.src = "img/zw.png";
            img.onerror = null;
        }
        // var urlArr = url.split(".");
        // console.log(urlArr);
        // var img = event.srcElement;
        // img.src = "img/" + urlArr[0] + ".png";

    }
    /**渲染查询出的数据**/
    function renderQueryData(data) {

        $(".js-meetingTableBox").empty();
        if(data){
            data.forEach(function (item,index) {
                var statusObj = {
                    0:" 未开始",
                    1:"初始化中",
                    2:"初始化结束",
                    3:"会议中",
                    4:"会议结束"
                };
                var statusBtnObj = {
                    0:" 发送",
                    1:"初始化中",
                    2:"",
                    3:"",
                    4:""
                };
                var statusClassObj = {
                    0:"js-sendBtn",
                    1:"js-initBtn",
                    2:"js-startMeetingBtn",
                    3:"js-endMeetingBtn",
                    4:"js-endBtn"
                };
                var editBtn = item.status == 0?"js-editMeeting":"editBtnDisable";
                var errCountClassName = "display:block";
                if(item.errCount == 0){
                    errCountClassName = "display:none"
                }else{
                    errCountClassName = "display:block"
                }
                var num = index + 1;
                var timeArr = (item.seTime).replace("#","-").split('-');

                var meetingTime = timeArr[0]+"年"+timeArr[1]+"月"+timeArr[2]+"日"+" "+timeArr[3]+"-"+timeArr[4];
                var tr = $('<tr>\n' +
                    '<td>'+num+'</td>\n' +
                    '<td title="'+covernString(item.m_title)+'">'+covernString(item.m_title)+'</td>\n' +
                    '<td title="'+meetingTime+'">'+meetingTime+'</td>\n' +
                    '<td title="'+covernString(item.roomAddr)+'">'+covernString(item.roomAddr)+'</td>\n' +
                    '<td>'+item.roomName+'</td>\n' +
                    '<td>总人数：'+item.participants.length+'人；已到会人数：'+item.signCount+'人' +
                    '<div class="result-btn fr js-seatViewBtn" data-id="'+item.id+'">查看</div>\n' +
                    '</td>\n' +
                    '<td>'+statusObj[item.status]+'</td>\n' +

                    '<td>\n' +
                    '<div style="display: flex;">'+
                    '<div class="result-btn fl '+editBtn+'" data-id="'+item.id+'">修改</div>\n' +
                    '<div class="result-btn fl '+statusClassObj[item.status]+'" data-id="'+item.id+'">'+statusBtnObj[item.status]+'</div>\n' +
                    '<div class="result-btn fl js-deleteMeeting" data-id="'+item.id+'">删除</div>\n' +
                    '<div class="result-btn fl js-printMeeting" data-id="'+item.id+'">预览</div>\n' +
                    '<div class="result-btn fl js-addBatchEmployee" data-id="'+item.id+'">导出Excel</div>\n' +
                    '<div class="result-btn fl js-resendMeeting " style="'+errCountClassName+'" data-id="'+item.id+'">失败记录</div>' +
                    '</div>'+
                    '</td>\n' +
                    '</tr>').data("meetingData",item);
                $(".js-meetingTableBox").append(tr);
            });
        }

    }
    //弹出新建
    var addMeetingHtml = function () {
        $(".js-addResult").click(function () {
            //window.open("setChry.html");
            parent.$(".js-iframe").attr("src","../hygl/setChry.html");
        });
    };

    /**删除会议**/
    var deleteMeeting = function () {
        $("body").delegate(".js-deleteMeeting","click",function () {
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
                layer.msg("确定删除此会议吗?",{
                    icon:5,
                    time:0,
                    area:'400px',
                    btn: ['确定', '取消'],
                    yes:function (index) {
                        $.ajax({
                            type:"post",
                            url:"../../../delMeeting.action",
                            data:{"id":id},
                            dataType:"json",
                            success:function (data) {
                                if(data.status == '0'){
                                    layui.use(['layer'], function(){
                                        var layer = layui.layer;
                                        layer.msg("删除会议成功！");
                                    });
                                    layer.close(index);
                                    loadQueryData("","","","",bus.offset,bus.pageSize);
                                }else if(data.status == '-4'){
                                    window.parent.location.href ='../../login/index.html';
                                }else{
                                    layui.use(['layer'], function(){
                                        var layer = layui.layer;
                                        layer.msg("删除设备失败！");
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
    //查看座椅布局
    var seatView = function () {
        $("body").delegate(".js-seatViewBtn","click",function () {
            var meetingData = $(this).parent().parent().data("meetingData").seatlout;
            sessionStorage.setItem('meetingDataView',JSON.stringify(meetingData));
            //渲染座椅已选 状态
            var participantsData = $(this).parent().parent().data("meetingData").participants;
            sessionStorage.setItem('participantsData',JSON.stringify(participantsData));
            // $(".js-seatViewBox").show();
            //window.open("setChrySeat.html");
            parent.$(".js-iframe").attr("src","../hygl/setChrySeat.html");
        });
        $(".js-closeSeatViewBox").click(function () {
            $(".js-seatViewBox").hide();
            $(".js-seatViewNumBox").empty();
            $(".js-seatViewmain").empty();
        });
    };

    //结束会议
    var endMeeting = function () {
        $("body").delegate('.js-endMeetingBtn','click',function () {
            var id = $(this).attr("data-id");

            $.ajax({
                type:"post",
                url:"../../../overMeeting.action",
                data:{"id":id},
                dataType:"json",
                success:function (data) {
                    if(data.status == '0'){
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("发送成功！",{icon:6});
                        });
                        loadQueryData("","","","",bus.offset,bus.pageSize);
                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });
    };
    //预览会议签到
    var printMeetingSignInfo = function () {
        $("body").delegate('.js-printMeeting','click',function () {
            var mId = $(this).attr("data-id");

            $.ajax({
                type:"post",
                url:"../../../printMeetingSignInfo.action",
                data:{"m_id":mId},
                dataType:"json",
                success:function (data) {

                    if(data.status == '0'){
                        sessionStorage.setItem('printMeeting',JSON.stringify(data));
                        //window.open("printMeetingSignInfo.html?");
                        parent.$(".js-iframe").attr("src","../hygl/printMeetingSignInfo.html");

                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });
    };
    //查看失败数据记录
    var resendMeeting = function () {
        var id = "";
        $("body").delegate(".js-resendMeeting","click",function () {
            $(".js-resendBox").show();
            // //重新发送请求
            var mId = $(this).attr("data-id");
            id = mId;
            $.ajax({
                type:"post",
                url:"../../../queryErrorInfoList.action",
                data:{"m_id":mId,"offset":"","pageSize":""},
                dataType:"json",
                success:function (data) {

                    if(data.status == '0'){
                        bus.dataLength = data.resp.data.length;
                        renderErrCountData(data.resp.data)
                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });
        $(".js-closeResendBox").click(function () {
            $(".js-resendBox").hide();
        });
        //重新发送
        $("body").delegate(".js-errCountSend","click",function () {

            $.ajax({
                type:"post",
                url:"../../../initErrorData.action",
                data:{"id":id},
                dataType:"json",
                success:function (data) {
                    if(data.status == '0'){
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("重新发送成功！",{icon:6});
                        });
                        $(".js-resendBox").hide();

                        loadQueryData("","","","",bus.offset,bus.pageSize);
                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }else{
                        layui.use(['layer'], function(){
                            var layer = layui.layer;
                            layer.msg("重新发送失败！",{icon:6});
                        });
                    }
                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        });
    };
    /**渲染查询出的失败数据**/
    function renderErrCountData(data) {
        $(".js-errCuntTableBox").empty();
        if(data){
            data.forEach(function (item,index) {
                var num = index+1;
                var tr = '<tr>\n' +
                    '<td>'+num+'</td>\n' +
                    '<td>'+item.employeeName+'</td>\n' +
                    '<td>'+item.company+'</td>\n' +
                    '<td>'+item.department+'</td>\n' +
                    '<td>'+item.phone+'</td>\n' +
                    '</tr>';
                $(".js-errCuntTableBox").append(tr);
            });
        }

    }
    /**导出Excel**/
    var addBatchEmployee = function () {
        $("body").delegate('.js-addBatchEmployee','click',function () {
            var mId = $(this).attr("data-id");

            layui.config({
                base: '../../../resource/js/layui_exts/'
            }).extend({
                excel: 'excel'
            });
            layui.use(['jquery', 'excel', 'layer'], function() {
                var $ = layui.jquery;
                var layer = layui.layer;
                var excel = layui.excel;

                // 模拟从后端接口读取需要导出的数据
                $.ajax({
                    type:"post",
                    url: '../../../printMeetingSignInfo.action',
                    data:{"m_id":mId},
                    dataType: 'json',
                    success: function(data) {
                        var data = data.resp.data;
                        // 重点！！！如果后端给的数据顺序和映射关系不对，请执行梳理函数后导出
                        data = excel.filterExportData(data, {
                            index:'index',
                            employeeName: 'employeeName',
                            company: 'company',
                            department: function(value, line, data) {
                                if(value==null||value=='null'||value==undefined||value=='undefined'||value==''){
                                    return '';
                                }else{
                                    return value;
                                }
                            },
                            lev: function(value, line, data) {
                                if(value==null||value=='null'||value==undefined||value=='undefined'||value==''){
                                    return '';
                                }else{
                                    return value;
                                }
                            },
                            signTime: 'signTime',
                            signStatus: function(value, line, data) {
                                if(value == '0'){
                                    return "是";
                                }else{
                                    return "否";
                                }
                            }
                        });
                        // 重点2！！！一般都需要加一个表头，表头的键名顺序需要与最终导出的数据一致
                        data.unshift({ index:"序号",employeeName: "姓名", company: '公司',department:'部门',lev:'级别',  signTime: '签到时间', signStatus: '签到' });
                        var timestart = Date.now();
                        excel.exportExcel({
                            sheet1: data
                        }, '参会人员.xlsx', 'xlsx');
                        var timeend = Date.now();
                    }
                    ,error: function() {
                        layer.msg('获取数据失败');
                    }
                });
            });
        });
    };
    /**修改会议**/
    var  editMeeting = function () {
        $("body").delegate(".js-editMeeting","click",function () {
            var mId = $(this).attr("data-id");

            var editMeetingData = $(this).parent().parent().parent().data("meetingData");

            sessionStorage.setItem('editMeetingData',JSON.stringify(editMeetingData));
            //window.open("editMeeting.html");
            parent.$(".js-iframe").attr("src","../hygl/editMeeting.html");
        });

    };
    /**发送**/
    var initMeeting = function () {
        $("body").delegate('.js-sendBtn','click',function () {
            // var loading =  layui.use(['layer'], function(){
            //     var layer = layui.layer;
            //     layer.msg('发送中', {
            //         icon: 16
            //         ,shade: 0.01
            //     });
            // });

            var id = $(this).attr("data-id");
            $.ajax({
                type:"post",
                url:"../../../initMeeting.action",
                data:{"id":id},
                dataType:"json",
                success:function (data) {
                    console.log(data);
                    initMeetingData = data;

                    if(data.status == '0'){
                        progress(id);
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
        });

    };
    /**进度条**/
    var progress = function (id) {

        clearInterval(time);
        var progressTime = setInterval(function () {
            $.ajax({
                type:"post",
                url:"../../../queryPlanSpeed.action",
                data:{"id":id},
                dataType:"json",
                success:function (data) {
                    console.log(data);


                    //
                    $(".js-progress-text").text("0%");
                    $(".js-progress-bar").width("0%");
                    if(data.status == '0'){
                        $(".js-progress-main").show();//打开进度条
                        //$(".js-progress-main").css({"display":"flex"});//打开进度条
                        //将进度条压入
                        $(".js-progressConBox").empty();
                        for(var i = 1;i<=data.resp.data.length;i++){
                            var jdt = '<div class="progress-con">\n' +
                                '            <div class="progress-box">\n' +
                                '                <div class="zhangbo-bg-box">\n' +
                                '                    <div class="zhangbo-bg-bar js-progress-bar'+i+'"><span class="zhangbo-bg-text js-progress-text'+i+'">0%</span></div>\n' +
                                '                </div>\n' +
                                '            </div>\n' +
                                '        </div>';

                            $(".js-progressConBox").append(jdt);
                        }
                        //数据渲染====
                        var planSpeedArr = [];
                        data.resp.data.forEach(function (item,index) {
                            planSpeedArr.push(item.planSpeed);
                            var num = index+1;
                            if(item.planSpeed == '50%'){
                                $(".js-progress-text"+num).css({"right":"0px"});
                            }
                            // if(item.planSpeed == '100%'){
                            //
                            // }else{
                            //操作进度条
                            //clearInterval(time);
                            $(".js-progress-text"+num).text(item.planSpeed);
                            $(".js-progress-bar"+num).width(item.planSpeed);
                            // }

                        });

                        //判断多设备是不是都到100%
                        var allsame = true;
                        //console.log('planSpeedArr.length:'+planSpeedArr.length);
                        for(var i=0;i<planSpeedArr.length;i++){
                            //console.log('planSpeedArr[i]:'+planSpeedArr[i]);
                            if(planSpeedArr[i] != '100%'){
                                //console.log('step1……');
                                allsame = false;
                                break;
                            }

                        }
                        if(allsame == true){//多设备完成
                            //$(".js-progress-text"+num).text(item.planSpeed);
                            //$(".js-progress-bar"+num).width(item.planSpeed);
                            clearInterval(progressTime);
                            time = setInterval(function () {
                                loadQueryData("","","","",bus.offset,bus.pageSize);
                            },6000);//进度条完成重新开启页面刷新
                            setTimeout(function () {
                                refreshMeetingStatus();//进度条完成刷新会议发送状态
                            },500);
                        }


                    }else if(data.status == '-4'){
                        window.parent.location.href ='../../login/index.html';
                    }else{
                        layer.msg(data.resp,{icon:5});
                        $(".js-progress-main").hide();

                    }

                },
                error:function () {
                    console.error("Ajax请求失败!");
                }
            });
        },500);
    };
    /**刷新会议发送状态**/
    var refreshMeetingStatus = function () {
        console.log(initMeetingData);
        $(".js-progress-main").hide();//关闭进度条
        //发送成功
        layui.use(['layer'], function(){
            var layer = layui.layer;
            layer.msg("发送成功！",{icon:6});
            //layer.close(loading);
        });
        loadQueryData("","","","",bus.offset,bus.pageSize);
        location.reload();
    };

    /**放大照片**/
    var getBigImg = function () {
        $("body").delegate('.js-getBigImg','dblclick',function () {
            $(".js-bigImgBox").show();
            var src = $(this).attr("src");
            var img =  '<img src="'+src+'" style="width: 100%;height: 100%;">';
            $(".js-bigImgMain").empty().append(img);
        });
        $(".js-closebigImgBox").click(function () {
            $(".js-bigImgBox").hide();
        });
    };
    return {
        init:init,
        imgerrorfun:imgerrorfun
    }
}();
