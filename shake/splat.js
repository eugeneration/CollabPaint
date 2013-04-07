var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    painting = false,
    lastX = 0,
    lastY = 0,
    lineThickness = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.ratio = canvas.width/canvas.height;

canvas.setcolor = function (hex) {
    ctx.fillStyle = "#" + hex;
}

canvas.splat = function (x, y, power, xdir, ydir) {
    canvas.drawsplat(x * canvas.width, y * canvas.height, power, 0, xdir, ydir);
}

canvas.drawsplat = function (x, y, power, num, xdir, ydir) {
    canvas.drawcircle(x, y, power);
    if (num != 5) {
        
        canvas.drawsplat(x + (Math.random() - xdir) * power / 2, y + (Math.random() - ydir) * power / 2, power/(1.5 + Math.random()), num + 1, xdir, ydir);
        canvas.drawsplat(x + (Math.random() - xdir) * power * 2, y + (Math.random() - ydir)  * power * 2, power/ (1.3 + Math.random()), num + 1, xdir, ydir);
        canvas.drawsplat(x + (Math.random() - xdir) * power * 4, y + (Math.random() - ydir) * power * 4, power/ (2 + 2*Math.random()), num + 1, xdir, ydir);
    }
}

canvas.drawcircle = function (x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
}

canvas.onmousedown = function(e) {
    painting = true;
    lastX = e.pageX - this.offsetLeft;
    lastY = e.pageY - this.offsetTop;
};

canvas.onmouseup = function(e){
    painting = false;
}

canvas.onmousemove = function(e) {
    if (painting) {
        mouseX = e.pageX - this.offsetLeft;
        mouseY = e.pageY - this.offsetTop;

        // find all points between        
        var x1 = mouseX,
            x2 = lastX,
            y1 = mouseY,
            y2 = lastY;


        var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
        if (steep){
            var x = x1;
            x1 = y1;
            y1 = x;

            var y = y2;
            y2 = x2;
            x2 = y;
        }
        if (x1 > x2) {
            var x = x1;
            x1 = x2;
            x2 = x;

            var y = y1;
            y1 = y2;
            y2 = y;
        }

        var dx = x2 - x1,
            dy = Math.abs(y2 - y1),
            error = 0,
            de = dy / dx,
            yStep = -1,
            y = y1;
        
        if (y1 < y2) {
            yStep = 1;
        }
       
        lineThickness = 5 - Math.sqrt((x2 - x1) *(x2-x1) + (y2 - y1) * (y2-y1))/10;
        if(lineThickness < 1){
            lineThickness = 1;   
        }

        for (var x = x1; x < x2; x++) {
            if (steep) {
                ctx.fillRect(y, x, lineThickness , lineThickness );
            } else {
                ctx.fillRect(x, y, lineThickness , lineThickness );
            }
            
            error += de;
            if (error >= 0.5) {
                y += yStep;
                error -= 1.0;
            }
        }



        lastX = mouseX;
        lastY = mouseY;

    }
}

