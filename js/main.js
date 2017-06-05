/**
 * Created by Goodluck on 2017/5/2.
 */
var SQUARE_LENGTH = 600;
var A = SQUARE_LENGTH / 2;
var canvas;
var context;
var CHART_SCALL = SQUARE_LENGTH * 0.45;

var normalizedImpedanceR;
var normalizedImpedanceI;
var characteristicImpedance;
var impedanceR;
var impedanceI;
var VSWR;
var travelingWaveCoefficient;
var WaveNode;
var Dianchangdu1;
var DianchangduJiaodu;
var check;
var radio;
var Dianchangdu2;
var matchPosition;
var matchLength;
var TouchDown = false;
var reflectionValue;
var daoNaValue;

window.onload = function () {
    findElements();
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = SQUARE_LENGTH;
    canvas.height = SQUARE_LENGTH;
    context.translate(A, A);
    drawBasicSmithChart();

    canvas.addEventListener("mousedown", function (event) {
        TouchDown = true;
        addChart(event);
    });
    canvas.addEventListener("mouseup", function () {
        TouchDown = false;
    });
    canvas.addEventListener("mousemove", function (event) {
        if (TouchDown) addChart(event);
    });
};

/**
 * 找到控件
 */
function findElements() {
    impedanceR = document.getElementById("impedanceR");
    impedanceI = document.getElementById("impedanceI");
    characteristicImpedance = document.getElementById("characteristicImpedance");
    normalizedImpedanceR = document.getElementById("normalizedImpedanceR");
    normalizedImpedanceI = document.getElementById("normalizedImpedanceI");
    daoNaValue = document.getElementById("daoNaValue");
    VSWR = document.getElementById("VSWR");
    travelingWaveCoefficient = document.getElementById("travelingWaveCoefficient");
    WaveNode = document.getElementById("WaveNode");
    Dianchangdu1 = document.getElementById("dianchangdu1");
    Dianchangdu2 = document.getElementById("dianchangdu2");
    DianchangduJiaodu = document.getElementById("dianchangdujiaodu");
    matchPosition = document.getElementById("matchPosition");
    matchLength = document.getElementById("matchLength");
    check = document.getElementById("check");
    reflectionValue = document.getElementById("reflectionValue");
    radio = document.getElementsByName("dianchangdu");
}


/**
 * 计算并设置特征阻抗
 */
function calCharacteristicImpedance() {
    var z0 = parseFloat(characteristicImpedance.value);
    normalizedImpedanceR.value = parseFloat(impedanceR.value) / z0;
    normalizedImpedanceI.value = parseFloat(impedanceI.value) / z0;

}


/**
 * 为鼠标添加事件添加圆图
 * @param event:
 */
function addChart(event) {
    var point = {};
    var real, imagin;
    point.x = getMousePoint(event).x / CHART_SCALL;
    point.y = getMousePoint(event).y / CHART_SCALL;
    if ((point.x) * (point.x) + (point.y ) * (point.y) <= 1) {
        clearPaper();
        addDengFanSheXiShuYuan(point);
        if (!check.checked) {
            imagin = addSmithReact(point);
            real = addSmithResistance(point);
        } else {
            imagin = diankangByPoint(point);
            real = dianzuByPoint(point);
        }

        drawBlackDian(point);

        //设置归一化阻抗值
        normalizedImpedanceR.value = Math.round(real * 100) / 100;
        normalizedImpedanceI.value = Math.round(imagin * 100) / 100;

        new SetPanel(point);
        if (check.checked) {
            match(point);
        }
    }
}

/**
 * 进行单支节匹配
 * @param point
 */
function match(point) {
    var point0 = {x: 0, y: 0};
    var point1 = getZuobioadianBydengfanshedianzu(point);
    var point2 = {x: point1.x, y: -point1.y};
    var point3 = {x: Math.cos(Math.atan2(point1.y, point1.x)), y: Math.sin(Math.atan2(point1.y, point1.x))};
    var point4 = {x: Math.cos(Math.atan2(point2.y, point2.x)), y: Math.sin(Math.atan2(point2.y, point2.x))};
    var point5 = {x: -point.x, y: -point.y};

    dramSmithResistance(context, 1, "red");
    drawLine(point0, point3);
    drawLine(point0, point4);
    drawLine(point5, point);
    addSmithReact(point1);
    addSmithReact(point2);
    var point33 = {x: -point.x, y: -point.y};
    // console.log(dainchangduByPoint(point3), dainchangduByPoint(point4), dainchangduByPoint(point33));//依次为上下的对应的电长度
    var point11 = getDiankangyuanJiaodian(point1);
    var point12 = getDiankangyuanJiaodian(point2);
    // console.log(dainchangduByPoint(point11), dainchangduByPoint(point12));//依次为上下的对应的电长度
    var zjwz1 = 0.5 - dainchangduByPoint(point33) + dainchangduByPoint(point3);
    var zjwz2 = 0.5 - dainchangduByPoint(point33) + dainchangduByPoint(point4);
    var zjcd1 = dainchangduByPoint(point2) - 0.25;
    var zjcd2 = 0.25 + dainchangduByPoint(point1);
    // console.log(zjwz1, zjwz2, zjcd1, zjcd2);
    matchPosition.innerHTML = "情况1      " + MyRound(zjwz1) + "情况2:      " + MyRound(zjwz2);
    matchLength.innerHTML = "情况1:       " + MyRound(zjcd1) + "情况2:      " + MyRound(zjcd2);

    drawBlackDian(point1);
    drawBlackDian(point2);
    drawBlackDian(point3);
    drawBlackDian(point4);
    drawBlackDian(point5);
    drawBlackDian(point);
    drawBlackDian(point11);
    drawBlackDian(point12);
}


/**
 * 通过数据输入来画图
 */
function addChartByTable() {
    var zuKang_real_value = parseFloat(normalizedImpedanceR.value);
    var zuKang_image_value = parseFloat(normalizedImpedanceI.value);

    var point = getZuobioadianBydainzudiankang(zuKang_real_value, zuKang_image_value);
    clearPaper();
    if (!check.checked) {
        addSmithReact(point);
        addSmithResistance(point);
    }
    addDengFanSheXiShuYuan(point);
    drawBlackDian(point);
    new SetPanel(point);
    if (check.checked) {
        match(point);
    }
}

/**
 * 写入是不是波节点
 * @constructor
 * @param point
 */
function SetWaveNode(point) {
    var s;
    if (point.y === 0 && point.x > 0) {
        s = "是波节点";
    } else if (point.y === 0 && point.x < 0) {
        s = "是波腹点";
    } else {
        s = "是一般点";
    }
    WaveNode.innerHTML = s;
}

/**
 * 设置显示数据
 * @param point 没有比例的交点。
 * @constructor
 */
function SetPanel(point) {
    //设置对应的电导值
    var point2 = {x: -point.x, y: -point.y};
    var fanshexishu = new Plural(point.x, point.y);
    var zhubobi = (1 + fanshexishu.Mo()) / (1 - fanshexishu.Mo());
    var xingboxishu = (1 - fanshexishu.Mo()) / (1 + fanshexishu.Mo());
    WriteNumberToSpan(VSWR, zhubobi);
    WriteNumberToSpan(travelingWaveCoefficient, xingboxishu);
    WritePlural(reflectionValue, fanshexishu.real, fanshexishu.imagin);
    WriteNumberToSpan(Dianchangdu1, dainchangduByPoint(point));
    WritePlural(daoNaValue, dianzuByPoint(point2), diankangByPoint(point2));
    WriteNumberToSpan(Dianchangdu2, dainchangduByPoint(point2));
    new SetWaveNode(point);
}

function WriteNumberToSpan(span, num) {
    span.innerHTML = MyRound(num);
}

/**
 * @return {number}
 */
function MyRound(num) {
    return Math.round(num * 1000) / 1000;
}
function WritePlural(span, real, imagin) {
    span.innerHTML = imagin > 0 ? MyRound(real) + "+j" + MyRound(imagin) : MyRound(real) + "-j" + (-MyRound(imagin));
}

/**
 * 通过坐标点获取电长度
 * @param point
 * @returns {number}
 */
function dainchangduByPoint(point) {
    var a;
    if (radio[0].checked) {
        a = -1;  // 面向电源
    } else {
        a = 1;//    面向负载
    }
    return Math.atan2(point.y, point.x) / (2 * Math.PI) * 0.5 * a + 0.25;
}

/**
 * 由坐标点获取电抗值
 * @param point 已经去比例的点
 * @returns {number}
 */
function diankangByPoint(point) {
    return 2 * point.y / (point.x * point.x + point.y * point.y - 2 * point.x + 1);
}

/**
 * 由坐标点获得电抗圆与单位圆焦点
 * @param point
 */
function getDiankangyuanJiaodian(point) {
    var r = 1 / diankangByPoint(point);
    var a = Math.atan2(r, 1);
    return {x: Math.cos(2 * a), y: Math.sin(2 * a)}
}

/**
 * 通过坐标获取电阻值
 * @param point 已经去比例的坐标点
 * @returns {number}
 */
function dianzuByPoint(point) {
    var m = 1 + point.x - point.y * point.y / (1 - point.x);
    return m / (2 - m);
}

/**
 * 获取无比例交点
 * @param real 没有比例的实部
 * @param imagin 没有比例的虚部
 */
function getZuobioadianBydainzudiankang(real, imagin) {
    var guiyihuazukang = new Plural(real, imagin);
    var k = new Plural(1, 0);
    var fanshexishu = (guiyihuazukang.subTract(k)).divi(guiyihuazukang.add(k));
    return {x: fanshexishu.real, y: fanshexishu.imagin};
}

/**
 * 获取无比例交点
 * @param point
 */
function getZuobioadianBydengfanshedianzu(point) {
    var r = Math.sqrt(point.x * point.x + point.y * point.y);
    return {
        x: r * r,
        y: r * Math.sqrt(1 - r * r)
    };
}

/**
 * 通过坐标添加电阻圆,返回添加电阻圆的实部系数
 * @param point
 * @returns {number}
 */
function addSmithResistance(point) {
    var r = dianzuByPoint(point);
    dramSmithResistance(context, r, "green");
    return r;
}

/**
 * 通过坐标添加电抗圆,返回添加电抗圆的虚部
 * @param point
 * @returns {number}
 */
function addSmithReact(point) {
    var r = diankangByPoint(point);
    drawSmithReact(context, r, "blue");
    return r;
}

/**
 * 通过坐标添加等反射系数圆
 * @param point 没有比例的点
 * @returns {number} 没有比例的距离
 */
function addDengFanSheXiShuYuan(point) {
    var r = Math.sqrt(point.x * point.x + point.y * point.y);
    drawCircle(context, 0, 0, r * CHART_SCALL, "purple");
    return r;
}

/**
 * 获取鼠标指针在canvas上的坐标
 * @param event
 * @returns {{x: number, y: number}}
 */
function getMousePoint(event) {
    var X = event.clientX - canvas.getBoundingClientRect().left;
    var Y = event.clientY - canvas.getBoundingClientRect().top;
    return {x: X - 300, y: 300 - Y}

}

//--------------------------------------基本图形绘制-----------------------------------
/**
 * 描绘交点
 * @param point 没有比例的点
 */
function drawBlackDian(point) {
    context.save();
    context.beginPath();
    context.fillStyle = "red";
    context.arc(point.x * CHART_SCALL, -point.y * CHART_SCALL, 5, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
    context.restore();
}

/***
 * 恢复基础画布
 */
function clearPaper() {
    context.clearRect(-CHART_SCALL, -CHART_SCALL, CHART_SCALL * 2, CHART_SCALL * 2);
    drawBasicSmithChart();
}

/**
 * 裁切画布
 * @param context
 */
function extracted(context) {
    context.beginPath();
    context.arc(0, 0, CHART_SCALL + 1, 0, 2 * Math.PI);
    context.clip();
}

/**
 * 绘制基图形
 */
function drawBasicSmithChart() {
    drawCoordinate(context);
    var a = [0, 0.5, 1, 2];
    a.forEach(function (value) {
        dramSmithResistance(context, value, "gray");
    });
    var b = [-2, -1, -0.5, 0, 0.5, 1, 2];
    b.forEach(function (value) {
        drawSmithReact(context, value, "gray");
    })
}

/**
 * 绘制电阻圆
 * @param context
 * @param resistance
 * @param color
 */
function dramSmithResistance(context, resistance, color) {
    var x = resistance / (resistance + 1);
    var r = 1 / (resistance + 1);
    drawCircle(context, CHART_SCALL * x, 0, CHART_SCALL * r, color);
}

/**
 * 绘制电抗圆
 * @param context
 * @param t
 * @param color
 */
function drawSmithReact(context, t, color) {
    extracted(context);
    if (t === 0) {
        context.save();
        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(-CHART_SCALL, 0);
        context.lineTo(CHART_SCALL, 0);
        context.stroke();
        context.restore();
    } else {
        var y = 1 / t * CHART_SCALL;
        var r = Math.abs(y);
        drawCircle(context, CHART_SCALL, y, r, color);
    }
}

/**
 * 画圆
 * @param context
 * @param x
 * @param y
 * @param r
 * @param color
 */
function drawCircle(context, x, y, r, color) {
    context.save();
    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = color;
    context.arc(x, -y, r, 0, 2 * Math.PI);
    context.stroke();
    context.restore();
}

/**
 * 画线
 * @param Start
 * @param End
 */
function drawLine(Start, End) {
    context.save();
    context.beginPath();
    context.lineWidth = 3;
    context.moveTo(Start.x * CHART_SCALL, -Start.y * CHART_SCALL);
    context.lineTo(End.x * CHART_SCALL, -End.y * CHART_SCALL);
    context.stroke();
    context.restore();
}

/**
 * 绘画坐标轴
 * @param context
 */
function drawCoordinate(context) {
    context.save();
    context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(-A, 0);
    context.lineTo(A, 0);
    context.moveTo(A - 10, 10);
    context.lineTo(A, 0);
    context.lineTo(A - 10, -10);
    context.stroke();
    context.beginPath();
    context.moveTo(0, A);
    context.lineTo(0, -A);
    context.moveTo(10, -A + 10);
    context.lineTo(0, -A);
    context.lineTo(-10, -A + 10);
    context.stroke();

    context.font = "24px Courier New";
    context.fontStyle = "black ";
    context.textBaseline = "top";
    context.fillText("Γ", A - 30, 0);
    context.font = "15px Courier New";
    context.fillText("i", A - 20, 8);
    context.textAlign = "right";
    context.font = "24px Courier New";
    context.fillText("Γ", -4, -A + 5);
    context.font = "15px Courier New";
    context.fillText("r", 0, -A + 13);
    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillText("0", 0, 0);
    context.restore();
}