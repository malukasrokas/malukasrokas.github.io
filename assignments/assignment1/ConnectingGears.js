var ctx, canvas;
var edgeLength = 500;
var dragEnabled = false;
var rotate = 0;
                        //  x    y  rad  srad  tn   col
var BigGear = new Gear    (150, 180, 130, 145, 50, 'orange');
var SmallGear = new Gear  (327.6, 280, 55, 70, 18, 'blue');
var TriggerGear = new Gear(250, 400, 23, 36, 7, 'red');

function init() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    return setInterval(drawGears, 1);
}
// Pitagoro teorema randama ar dantiraciu atstumai yra mazesni uz ju spinduliu suma
function distanceBetweenLessThanRadiusSum(TriggerGearObj, TouchingGearObj) {

    // Tikslesnei kolizijai pridedamas papildomas atstumas tarp spinduliu
    additionalDistance = 0;

    if (TouchingGearObj == BigGear)
        additionalDistance = 7.4;

    else if (TouchingGearObj == SmallGear)
        additionalDistance = 4;

    return (Math.sqrt(Math.pow(TouchingGearObj.xPos - TriggerGearObj.xPos, 2) + Math.pow(TouchingGearObj.yPos - TriggerGearObj.yPos, 2)) <= TriggerGearObj.teethRadius+additionalDistance+TouchingGearObj.radius);
}

function drawGears(){

    rotAngle = Math.PI/180/25;
    ctx.clearRect(0, 0, edgeLength, edgeLength);

    SmallGear.enableRotation(rotate, rotAngle*(BigGear.teethNumber/SmallGear.teethNumber));
    BigGear.enableRotation(rotate*(-1), rotAngle);
    TriggerGear.enableRotation(1, rotAngle*(BigGear.teethNumber/SmallGear.teethNumber)/0.38875);

    if (distanceBetweenLessThanRadiusSum(TriggerGear, BigGear)) {
        rotate = 1;
        dragEnabled = false;
    }

    else if (distanceBetweenLessThanRadiusSum(TriggerGear, SmallGear)) {
        rotate = -1;
        dragEnabled = false;
    }

    else
        rotate = 0;
}

function Gear(xPos, yPos, radius, teethRadius, teethNumber, color) {

    var rotationAngle = 0;

    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.teethNumber = teethNumber;
    this.teethRadius = teethRadius; // Atstumas nuo dantiracio centro iki danties virsunes
    this.color = color;
    this.drawGear = function drawGear() {

        // rSmall ir rBig yra kampu laipsniai, kuriuose bus piesiami dantys
        var rSmall, rBig;
        var x, y, spikeX, spikeY;
        // Inkrementai, po kuriu bus piesiami dantys
        var incSmall = 360/this.teethNumber;
        var incBig = 360/this.teethNumber/2;

        // Dantiracio skritulys
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
        ctx.fill();

        // Dantiracio vidurys
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = this.color;
        rSmall = rBig = 0;

        // Dantu generavimas
        for (i = 0; i < this.teethNumber; i++, rSmall+=incSmall) {

            // Randamos trikampio kampo koordinates
            x = this.radius*Math.cos(Math.PI*rSmall/180);
            y = this.radius*Math.sin(Math.PI*rSmall/180);

            // Randamos dantens virsunes koordinates
            spikeX = this.teethRadius*Math.cos(Math.PI*(rSmall+incBig)/180);
            spikeY = this.teethRadius*Math.sin(Math.PI*(rSmall+incBig)/180);

            // Piesiamas trikampis
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(spikeX, spikeY);
            ctx.lineTo(this.radius*Math.cos(Math.PI*(rSmall+incSmall)/180), this.radius*Math.sin(Math.PI*(rSmall+incSmall)/180));
            ctx.fill();
            ctx.stroke();
        }
    }

    this.enableRotation = function enableRotation(direction, angleIncrement) {

        rotationAngle += angleIncrement;
        ctx.save();
        ctx.translate(this.xPos, this.yPos);

        switch(direction) {
            case 0: // Stovi vietoje
                rotationAngle = 0;
                break;
            case -1: // Sukasi pries laikrodzio rodykle
                ctx.rotate(-rotationAngle);
                break;
            case 1: // Sukasi pagal laikrodzio rodykle
                ctx.rotate(rotationAngle);
                break;
        }

        this.drawGear();
        ctx.restore();
    }
}

function mouseDrag(e) {

    if (dragEnabled) {
        TriggerGear.xPos = e.pageX - canvas.offsetLeft;
        TriggerGear.yPos = e.pageY - canvas.offsetTop;
    }
}

function mouseDown(e) {

        x = TriggerGear.xPos;
        y = TriggerGear.yPos;
        if (e.pageX < x + 20 + canvas.offsetLeft  && e.pageX > x -20 + canvas.offsetLeft &&
            e.pageY < y + 20 + canvas.offsetTop   && e.pageY > y -20 + canvas.offsetTop )
        {
            TriggerGear.xPos = e.pageX - canvas.offsetLeft;
            TriggerGear.yPos = e.pageY - canvas.offsetTop;
            dragEnabled = true;
            canvas.onmousemove = mouseDrag;
        }
}

function mouseUp() {

    dragEnabled = false;
    canvas.onmousemove = null;
}

init();
canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
