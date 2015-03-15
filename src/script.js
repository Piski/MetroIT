$(document).ready(function() {
    
	/*
	 *	https://wiki.metropolia.fi/display/tietohallinto/Vanha+maantie+6
	 *	ETYB114, ETYB116, ETYB202, ETYB203, ETYB204, ETYB205
	 *	ETYB302, ETYB303, ETYB311A, ETYB311B
	*/

	var classroom = ["ETYB114", "ETYB116", "ETYB202", "ETYB203", "ETYB204", "ETYA2123", "ETYB302", "ETYB303", "ETYB311"];

	$("body").swipe( {
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
	        reservationStatus(classroom[0]);
			reservationStatus(classroom[1]);
			reservationStatus(classroom[2]);
			reservationStatus(classroom[3]);
			reservationStatus(classroom[4]);
			reservationStatus(classroom[5]);
			reservationStatus(classroom[6]);
			reservationStatus(classroom[7]);
			reservationStatus(classroom[8]);
        },
         threshold:100
      });
});

function reservationStatus(classroom) {
	var time = new Date();
	var year = time.getFullYear();
	var month = (time.getMonth()+1);
	var date = time.getDate();
	var hours = time.getHours();
	var minutes = time.getMinutes();
    
    var room; // new
	var startHours = [];
	var endHours = [];
	var startMinutes = [];
	var endMinutes = [];
	freeHours = 0;
	freeMinutes = 0;

	$.ajax({
		url: "connect.php?year=" + year 
    							+ "&month=" + month 
    							+ "&date=" + date 
    							+ "&hours=" + hours
    							+ "&minutes=" + minutes,
		type: "GET",
		data: { get_param: 'value' }, 
		dataType: "json"
	}).done(function(data) {
		$.each(data.reservations, function(i, v) {
			var obj = v.resources;
			for (var key in obj) {
			  	if (obj.hasOwnProperty(key)) {
			    	room = obj[key].code;
			    	if(isReserved(room, classroom)) {
			    		console.log(v.startDate + " " + v.endDate);
			    		startHours.push(splitStartHours(v.startDate));
			    		startMinutes.push(splitStartMinutes(v.startDate));
			    		endHours.push(splitEndHours(v.endDate));
			    		endMinutes.push(splitEndMinutes(v.endDate));
			    	}
				}
			}
		}); 
		if(isFree(startHours, startMinutes, endHours, endMinutes, hours, minutes)) {
			setFree(classroom);
		} else {
			setReserved(classroom)
		}
	});
}

function isReserved(room, classroom) {
	var found = (room.indexOf(classroom) > -1);
	return found;
}

function splitStartHours(startTime) {
	var tmp = startTime[11] + startTime[12];
	return tmp;
}

function splitStartMinutes(startTime) {
	var tmp = startTime[14] + startTime[15];
	return tmp;
}

function splitEndHours(endTime) {
	var tmp = endTime[11] + endTime[12];
	return tmp;
}

function splitEndMinutes(endTime) {
	var tmp = endTime[14] + endTime[15];
	return tmp;
}

function isFree(startHours, startMinutes, endHours, endMinutes, hours, minutes) {
	var free = true;
	for(var i = 0; i < startHours.length; i++) {
		if(startHours[i] <= hours && endHours[i] >= hours) {
			if(startMinutes[i] <= minutes && (endMinutes[i] >= minutes || endHours[i] > hours)) {
				// jos täällä niin tarkoittaa että luokka on varattu
                untilFree(endHours, endMinutes, hours, minutes, i);
				free = false;
			}
		}
	}
	if (free) {
		untilReserved(startHours, startMinutes, hours, minutes);
	}
	return free;
}

function untilReserved(startHours, startMinutes, hours, minutes) {
	for(var i = 0; i < startHours.length; i++) {
		freeHours =  startHours[0] - hours;
		freeMinutes =  60 - (minutes - startMinutes[0]);
		if(freeMinutes > 0) {
			freeHours -= 1;
			if (freeMinutes > 60) {
				freeMinutes = startMinutes[0] - minutes;
				freeHours += 1;
			}
		}
        if(freeMinutes == 60) {
            freeMinutes = 0;
            freeHours += 1;
        }
	}
}

function untilFree(endHours, endMinutes, hours, minutes, i) {
	freeHours =  endHours[i] - hours;
	freeMinutes =  60 - (minutes - endMinutes[i]);
    if(freeMinutes > 0) {
        freeHours -= 1;
        if (freeMinutes > 60) {
            freeMinutes = endMinutes[i] - minutes;
            freeHours += 1;
        }
    }
    if(freeMinutes == 60) {
        freeMinutes = 0;
        freeHours += 1;
    }
}

function setFree(classroom) {
	console.log("The classroom is free for use! " + "hours: " + freeHours + " minutes: " + freeMinutes);
	$("#" + classroom).css("background-color", "#3fc380");
	$("#" + classroom).html(classroom + "&nbsp;&nbsp;&nbsp;&nbsp" + freeHours + " <span>HOURS</span> " + freeMinutes + " <span>MINUTES</span>");
}

function setReserved(classroom) {
	console.log("The classroom is in use :( " + "hours: " + freeHours + " minutes: " + freeMinutes)
	$("#" + classroom).css("background-color", "#e64b43");
	$("#" + classroom).html(classroom + "&nbsp;&nbsp;&nbsp;&nbsp" + freeHours + " <span>HOURS</span> " + freeMinutes + " <span>MINUTES</span>");
}
