var setSeat = function () {
    var init = function () {
        setSeatView();
    };
    function setSeatView() {
        var meetingData = JSON.parse(sessionStorage.getItem('meetingData'))==null?[]:JSON.parse(sessionStorage.getItem('meetingData'));
        console.log(meetingData);
        //渲染主席团座椅
        //$(".js-rostrumzwBox").empty();
        $(".js-rostrumzwBox").empty();
        for (var i = 0; i < meetingData.rostrumcolNum ; i++) {
            var div = "";
            for (var j = 0; j < meetingData.rostrumrowNum ; j++) {
                div += ' <div class="zw js-rostrumSelectZw js-rostrumSetSeatNum js-rostrumSetSelectZw no" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatStatus = "seat04" data-seatArea=""></div>';
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
                div += ' <div class="zw js-selectZw js-setSeatNum" data-className="false" data-type="true" data-seatNum = "'+(i+1)+'" data-colNum = "'+(i+1)+'"  data-seatId = "seat'+(i+1)+"-"+(j+1)+'" data-seatId = "seat'+(i+1)+(j+1)+'" data-seatStatus = "seat04"></div>';
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
            $(".js-selectZw[data-seatId='"+item.seatId+"']").attr("data-seatArea",item.seatArea);

        });
        // 关闭
        $(".js-closeSeatViewBox").click(function () {
            // $(".js-seatViewBox").hide();
            var data = [];
            sessionStorage.setItem('meetingData',JSON.stringify(data));
            //window.close("setSeat.html");
            parent.$(".js-iframe").attr("src","../hysgl/index.html");
            // $(".js-seatViewNumBox").empty();
            // $(".js-seatViewmain").empty();
        });
    }
    return {
        init:init
    }
}();
