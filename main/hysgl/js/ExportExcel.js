var ExportExcel = function () {
    var init = function () {
        loadExportExcel();
    };
    //加载座椅布局数据
    var loadExportExcel = function () {
        var ExportExcelData = JSON.parse(sessionStorage.getItem('ExportExcelData'))==null?[]:JSON.parse(sessionStorage.getItem('ExportExcelData'));
        console.log(ExportExcelData);
        //渲染座椅布局
        //1、渲染头部
        $(".js-ExportExcelHead").empty();
        $(".js-ExportExcelBody").empty();
        var ExportExcelHead = `<tr><td>列数</td><td>${ExportExcelData.rowNum}</td><td>排数</td><td>${ExportExcelData.colNum}</td><td>分布</td><td colspan="${parseInt(ExportExcelData.rowNum)+2 - 5}"></td></tr>`;
        $(".js-ExportExcelHead").append(ExportExcelHead);
        //2、渲染主体
        for (var i = 0; i < parseInt(ExportExcelData.colNum)+1 ; i++) {
            var td = "";
            for (var j = 0; j < parseInt(ExportExcelData.rowNum)+2 ; j++) {
                td += ' <td class="js-selectExcel" data-colNum = "'+(i+1)+'"  data-rowNum = "'+(j)+'"  data-seatId = "seat'+(i)+"-"+(j)+'" data-seatStatus = "seat04"></td>';
            }
            var tr = '<tr>'+td+'</tr>';
            $(".js-ExportExcelBody").append(tr);
        }
        //3.渲染主体座椅状态
        ExportExcelData.seatARR.forEach(function (item,index) {
            var meeting = {
                "seat01":"fydh",
                "seat02":"no",
                "seat03":"on",
                "seat05":"gzx",
                "seat06":"gd"
            };
            $(".js-selectExcel[data-seatId='"+item.seatId+"']").attr("data-seatStatus",item.seatStatus);
            $(".js-selectExcel[data-seatId='"+item.seatId+"']").attr("data-seatNum",item.seatNum);
            if(item.seatStatus == 'seat06'){
                //$(".js-selectExcel[data-seatId='"+item.seatId+"']").text('过道');
                $(".js-selectExcel[data-seatId='"+item.seatId+"']").css({"background":"#BFBFBF"});
                var seatIdRowNumArr = item.seatId.split("-");
                //更改过道头部的seatid
                $(".js-selectExcel[data-seatId='seat0-"+seatIdRowNumArr[1]+"']").attr("data-isgd","true");
                $(".js-selectExcel[data-seatId='seat0-"+seatIdRowNumArr[1]+"']").attr("data-colnum","0");
                $(".js-selectExcel[data-seatId='seat0-"+seatIdRowNumArr[1]+"']").text('过道');
                $(".js-selectExcel[data-seatId='seat0-"+seatIdRowNumArr[1]+"']").css({"background":"#BFBFBF","border-bottom":"0"});
                //更改添加的最后一列的seatid
                var lastNum = parseInt(ExportExcelData.rowNum)+1;
                $(".js-selectExcel[data-seatId='seat0-"+lastNum).attr("data-colnum","0");
            }else if(item.seatStatus == 'seat01'){
                $(".js-selectExcel[data-seatId='"+item.seatId+"']").text('等候区');
                $(".js-selectExcel[data-seatId='"+item.seatId+"']").css({"background":"#FFFF00"});
            }else if(item.seatStatus == 'seat05'){
                $(".js-selectExcel[data-seatId='"+item.seatId+"']").text('工作席');
                $(".js-selectExcel[data-seatId='"+item.seatId+"']").css({"background":"#BFBFBF"});
            }

        });
        //4.渲染主体头和左侧

        $(".js-selectExcel[data-colnum='1']").each(function (index,item) {
            var colnum = $(item).attr("data-colnum");
            var rownum =  $(item).attr("data-rownum");
            var isgd =  $(item).attr("data-isgd");
            if(colnum == "1" && rownum != "0" && isgd != "true"){
                console.log(index);
                $(item).text("第"+index+"列");
            }
        });
        $(".js-selectExcel[data-rownum='0']").each(function (index,item) {
            var colnum = $(item).attr("data-colnum");
            var rownum =  $(item).attr("data-rownum");
            var isgd =  $(item).attr("data-isgd");
            if(rownum == "0" && colnum != "1"){
                var n = colnum -1;
                $(item).text("第"+n+"排");
                $(item).css({"background":"#BFBFBF"});
                var lastNum = parseInt(ExportExcelData.rowNum)+1;
                $(".js-selectExcel[data-seatId='seat"+index+"-"+lastNum+"']").text("第"+n+"排");
                $(".js-selectExcel[data-seatId='seat"+index+"-"+lastNum+"']").css({"background":"#BFBFBF"});
            }

        });

        exportExcel();
    };
    var exportExcel = function () {
        // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
        var html = "<html><head><meta charset='utf-8' /></head><body>" + document.getElementsByTagName("table")[0].outerHTML + "</body></html>";
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        var blob = new Blob([html], { type: "application/vnd.ms-excel" });//xls
        // var blob = new Blob([html], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        var a = document.getElementsByTagName("a")[0];
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        a.href = URL.createObjectURL(blob);
        // 设置文件名
        a.download = "导出座椅模板.xls";
    };
    return {
        init:init
    }
}();