function get_event_elem(query, data) {
	var track = data['track'];
	var name = data['name'];
	var date = data['date'];
	els = document.querySelectorAll(query+'[data-event-track="'+track+'"][data-event-name="'+name+'"][data-event-date="'+date+'"]');
	return els[0];
}

function split_dates(tracks){
	var dict = {'expired': [], 'current': [], 'future': []};
	for (const [key, value] of Object.entries(tracks)) {
		var track = tracks[key].name;
		var dates = tracks[key].dates;
		var open_counter = 0;
		for (var i = 0; i < dates.length; i++) {
			var name = dates[i].name;
			var date = dates[i].date;
			var data = {'track': track, 'name': name, 'date': date};
			if(new Date(date) < new Date()){ // date expired
				dict['expired'].push(data);
			} else {
				if(open_counter > 0){
					dict['future'].push(data);
				} else {
					dict['current'].push(data);
				}
				open_counter += 1;
			}
		}
	}
	return dict;
}
	
// Reference: https://stackoverflow.com/a/9335296
function CountDownTimer(dt, el, show_second=false)
{
    var end = new Date(dt);

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {

            clearInterval(timer);
            el.innerHTML = 'Done';

            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        var remaining = [];
        if(days > 0)
        	remaining.push(days + ' days');
        if(hours > 0)
        	remaining.push(hours + ' hours');
        if(minutes > 0)
        	remaining.push(minutes + ' mins');
        if(show_second && seconds > 0)
        	remaining.push(seconds + ' secs');

        el.innerHTML = remaining.join(', ');
    }

    var refresh_rate = 1000;
    if(!show_second)
        refresh_rate *= 60;
    timer = setInterval(showRemaining, refresh_rate);
    showRemaining();
}

document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target;
    var dropdown = null;
    try {
        var dropdown = e.target.closest("li").querySelector('.dropdown');
    } catch {}
    
    var allDropdowns = document.querySelectorAll('.dropdown');
    for (var i = 0; i < allDropdowns.length; i++) {
        if(allDropdowns[i] == dropdown) continue;
        allDropdowns[i].classList.add("hidden");
    }

    if(dropdown != null){
        dropdown.classList.toggle('hidden');
    }
}, false);