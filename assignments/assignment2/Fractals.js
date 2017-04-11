var canvas, ctx;
var level = document.getElementById("level").innerHTML;
var previousLevel = level-1;
var transformID = document.getElementById("transform").innerHTML;
var animation;

function init() {
    canvas = document.getElementById('canvas2');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        fractalize(0);
    }
}

function drawShape() {
    ctx.beginPath();
    ctx.moveTo(0,250);

    ctx.lineTo(0,320); ctx.lineTo(110,375); ctx.lineTo(0,375); ctx.lineTo(0,500);
    ctx.lineTo(155,440); ctx.lineTo(190,375); ctx.lineTo(370,375); ctx.lineTo(250,440);
    ctx.lineTo(250,500); ctx.lineTo(375,500); ctx.lineTo(375,440); ctx.lineTo(500,500);
    ctx.lineTo(500,370); ctx.lineTo(440,370); ctx.lineTo(400,315); ctx.lineTo(330,280);
    ctx.lineTo(250,250); ctx.lineTo(420,180); ctx.lineTo(375,250); ctx.lineTo(500,250);
    ctx.lineTo(500,180); ctx.lineTo(390,125); ctx.lineTo(500,125); ctx.lineTo(500,0);
    ctx.lineTo(340,60); ctx.lineTo(310,125); ctx.lineTo(190,125); ctx.lineTo(125,250);
    ctx.lineTo(0,250);

    ctx.fill();
}

function fractalize(level) {
    if (level>0) {

        level = level - 1;
        ctx.save();
        ctx.save();
        ctx.save();

        if (level == previousLevel)
            ctx.fillStyle = "#8b0000";
        ctx.transform(-0.25, 0, 0, 0.25, canvas.width/4, canvas.height/4);
        ctx.rotate(Math.PI/2);
        fractalize(level);
        ctx.restore();

        if (level == previousLevel)
            ctx.fillStyle = "#ADC400";
        ctx.transform(0.5, 0, 0, 0.5, canvas.width/2, 0);
        fractalize(level);
        ctx.restore();

        if (level == previousLevel)
            ctx.fillStyle = "#A05959";
        ctx.transform(-0.5, 0, 0, -0.5, canvas.width/2, canvas.width);
        fractalize(level);
        ctx.restore();

        if (level == previousLevel)
            ctx.fillStyle = "#064D8D";
        ctx.transform(-0.5, 0, 0, 0.5, canvas.width, canvas.width/2);
        fractalize(level);

    }
    else
        drawShape();
}

function animate(quarter) {

    var targetTransform = {} ; // Galutines transformacijos
    var currentTransform =  // Pradines koord. sistemos transformacijos
    {
        a : 1,              // Horizontal scaling
        d : 1,              // Vertical scaling
        e : 0,              // Horizontal moving
        f : 0,              // Vertical moving
    };
    // targetTransform = norimos transformacijos kintamuju listas
    switch (quarter) {
        // Top-left
        case 1:
            targetTransform = {
                a : -0.25,
                d : 0.25,
                e : canvas.width/4,
                f : canvas.height/4,
            };
            break;

        // Top-right
        case 2:
            targetTransform = {
                a : 0.5,
                d : 0.5,
                e : canvas.width/2,
                f : 0,
            };
            break;

        // Bottom-left
        case 3:
            targetTransform = {
                a : -0.5,
                d : -0.5,
                e : canvas.width/2,
                f : canvas.width,
            };
            break;

        // Bottom-right
        case 4:
            targetTransform = {
                a : -0.5,
                d : 0.5,
                e : canvas.width,
                f : canvas.height/2,
            };
            break;
    }

    var intervals = 150;

    var addToA = (1-targetTransform.a)/intervals;
    var addToD = (1-targetTransform.d)/intervals;
    var addToE = (targetTransform.e)/intervals;
    var addToF = (targetTransform.f)/intervals;
    var addDegrees = Math.PI/2/intervals;
    var currentDegrees = 0;

    var fps = 60;

    function draw() {
        setTimeout(function() {
            animation = requestAnimationFrame(draw);

            currentTransform.a -= addToA;
            currentTransform.d -= addToD;
            currentTransform.e += addToE;
            currentTransform.f += addToF;

            if (quarter == 1)
                currentDegrees += addDegrees;

               if (currentTransform.a >= targetTransform.a - 0.01) {
                   ctx.clearRect(0, 0, canvas.width, canvas.height);
                   ctx.save();

                   ctx.transform(currentTransform.a, 0, 0, currentTransform.d, currentTransform.e, currentTransform.f);
                   if (quarter == 1)
                        ctx.rotate(currentDegrees);
                   drawShape();

                   ctx.restore();
                }

                if (currentTransform.a <= targetTransform.a-0.3)
                    cancelAnimationFrame(animation);

        }, 1000/fps);
    }
    draw();
}

function levelDown() {
    if (level == 0)
        return
    else {
        ctx.save();
        level--;
        previousLevel = level - 1;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,canvas.width, canvas.height);
        document.getElementById('level').innerHTML = level;
        ctx.clearRect(0,0,canvas.height, canvas.width);
        fractalize(level);
        ctx.restore();
    }
}

function levelUp() {
    if (level == 6)
        return
    else {
        ctx.save();
        level++;
        previousLevel = level - 1;
        ctx.setTransform(1,0,0,1,0,0);
        document.getElementById("level").innerHTML = level;
        ctx.clearRect(0,0,canvas.height, canvas.width);
        fractalize(level);
        ctx.restore();
    }
}

function transformPrevious() {
    if (transformID < 2)
        return
    else {
        transformID--;
        document.getElementById("transform").innerHTML = transformID;
        animate(transformID);
    }
}

function transformNext() {
    if (transformID == 4)
        return
    else {
        transformID++;
        document.getElementById("transform").innerHTML = transformID;
        animate(transformID);
    }
}

function retransform() {
    animate(transformID);
}

init();
