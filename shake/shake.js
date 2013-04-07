/*
 *
 * Find more about this plugin by visiting
 * http://alxgbsn.co.uk/
 *
 * Copyright (c) 2010-2012 Alex Gibson
 * Released under MIT license
 *
 */

(function (window, document) {

	function Shake() {

		//feature detect
		this.hasDeviceMotion = 'ondevicemotion' in window;

		//default velocity threshold for shake to register
		this.threshold = 5;

		//use date to prevent multiple shakes firing	
		this.lastTime = new Date();

		//accelerometer values
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;

		//create custom event
		this.event = document.createEvent('Event');
		this.event.initEvent('shake', true, true);
	}

	//reset timer values
	Shake.prototype.reset = function () {

		this.lastTime = new Date();
		this.lastX = null;
		this.lastY = null;
		this.lastZ = null;
	};

	//start listening for devicemotion
	Shake.prototype.start = function () {

		this.reset();
		if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
	};

	//stop listening for devicemotion
	Shake.prototype.stop = function () {

		if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
		this.reset();
	};
    

    var sumx = 0.0, sumy = 0.0, sumz = 0.0, count = 0;

	//calculates if shake did occur
	Shake.prototype.devicemotion = function (e) {

		var current = e.accelerationIncludingGravity,
			currentTime,
			timeDifference,
			deltaX = 0,
			deltaY = 0,
			deltaZ = 0;

		if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
            this.lastX = current.x;
			this.lastY = current.y;
			this.lastZ = current.z;
			return;
		}

		deltaX = Math.abs(this.lastX - current.x);
		deltaY = Math.abs(this.lastY - current.y);
		deltaZ = Math.abs(this.lastZ - current.z);

		if (((deltaX > this.threshold) && (deltaY > this.threshold)) || ((deltaX > this.threshold) && (deltaZ > this.threshold)) || ((deltaY > this.threshold) && (deltaZ > this.threshold))) {

			//calculate time in milliseconds since last shake registered
			currentTime = new Date();
			timeDifference = currentTime.getTime() - this.lastTime.getTime();

			if (timeDifference > 1000) {
                var text2;
                sumx += deltaX;
                sumy += deltaY;
                sumz += deltaZ;
                count++;
                
                var power = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

                if (current.z > 4) {
                    text2 = "LEFT SLASH!";
                }
                else if (current.z < -3) {
                    text2 = "RIGHT SLASH!";
                }
                else {
                    text2 = "FORWARD SLASH!";
                }
                
                $(".text").text("" + (sumx/count) + "\n" + (sumy/count) + "\n" + (sumz/count) + "\n\n" + current.x  + "\n" + current.y + "\n" + current.z + "\n" + text2 + "\n power " + power);
	            this.event.data = {'power':power};
                window.dispatchEvent(this.event);
				this.lastTime = new Date(); 
            }
		}
	};

	//event handler
	Shake.prototype.handleEvent = function (e) {

		if (typeof (this[e.type]) === 'function') {
			return this[e.type](e);
		}
	};

	//create a new instance of shake.js.
	var myShakeEvent = new Shake();
	myShakeEvent.start();

}(window, document));
