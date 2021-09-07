var setChrySeat = function () {
    var init = function () {
        setChrySeatView();
    };
    var setChrySeatView = function () {
        var meetingData = JSON.parse(sessionStorage.getItem('meetingDataView'))==null?[]:JSON.parse(sessionStorage.getItem('meetingDataView'));
        var participantsData = JSON.parse(sessionStorage.getItem('participantsData'))==null?[]:JSON.parse(sessionStorage.getItem('participantsData'));
        console.log(participantsData);
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
                div += ' <div class="zw js-selectZw js-setSeatNum" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatId = "seat'+(i+1)+(j+1)+'" data-seatStatus = "seat04" title=""></div>';
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
                "seat05":"gzx",
                "seat06":"gd",
                "seat07":"seat07"
            };
            $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass(meeting[item.seatStatus]);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatStatus",item.seatStatus);
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);

        });
        participantsData.forEach(function (item,index) {
            $(".js-selectZw[data-seatId='"+item.seatId+"']").addClass("on");
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatStatus","seat03");
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);
            var seatNUM = item.seatNum.replace("-","排");
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("title",item.employeeName+";"+seatNUM+"座")
            $(".js-selectZw[data-seatId='"+item.seatId+"']").append("<span style='position: absolute;top:50%;left: -1px;width: 100%;    transform: translateY(-50%);'>"+item.employeeName+"</span>");
        });

        // 关闭
        $(".js-closeSeatViewBox").click(function () {
            // $(".js-seatViewBox").hide();
            var data = [];
            sessionStorage.setItem('meetingDataView',JSON.stringify(data));
            sessionStorage.setItem('participantsData',JSON.stringify(data));
            //window.close("setChrySeat.html");
            parent.$(".js-iframe").attr("src","../hygl/index.html");
            $(".js-seatViewNumBox").empty();
            $(".js-seatViewmain").empty();
        });
    };

    return {
        init:init
    }
}();
