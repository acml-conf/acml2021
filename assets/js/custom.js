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

$('.iframe').magnificPopup({
    type: 'iframe',
    iframe: {
        markup: '<div class="mfp-iframe-scaler">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
              '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button

        patterns: {
            airtable: {
                index: 'airtable.com/',
                id: '/',
                src: '//airtable.com/embed/%id%'
            }
        }
    }
});

var DateTime = luxon.DateTime;

var dateTimeOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var timeOptions = DateTime.TIME_24_SIMPLE

function addHeader(tbody, elem, text){
    var trNode = document.createElement("tr");
    var tdNode = document.createElement("td");
    var textNode = document.createTextNode(text);
    trNode.appendChild(tdNode);
    tdNode.appendChild(textNode);
    tdNode.colSpan = 3;
    tdNode.style.color = 'white';
    tdNode.style.background = 'gray';
    tdNode.style.textAlign = 'center';
    tdNode.style.fontWeight = 'bold';
    trNode.classList.add('schedule-date-header');

    tbody.insertBefore(trNode, elem.parentNode);
}

function formatSchedule(table, timezone = 'local'){
    var tbody = table.getElementsByTagName('tbody')[0];
    var scheduleDateHeaders = tbody.getElementsByClassName('schedule-date-header');
    while (scheduleDateHeaders.length > 0) scheduleDateHeaders[0].remove();
    var lastDT = null;
    var sessionElems = tbody.querySelectorAll('*[data-start-at]');
    for(var elem of sessionElems){
        var sessionStartDT = DateTime.fromISO(elem.getAttribute('data-start-at')).setZone(timezone);
        var sessionEndDT = DateTime.fromISO(elem.getAttribute('data-end-at')).setZone(timezone);

        if(lastDT == null || !sessionStartDT.hasSame(lastDT, 'day')){
            addHeader(tbody, elem, sessionStartDT.toLocaleString(dateTimeOptions));
        }
        elem.innerHTML = sessionStartDT.toLocaleString(timeOptions) +" - "+ sessionEndDT.toLocaleString(timeOptions);
        var diffDay = sessionEndDT.get('day') - sessionStartDT.get('day');
        if(diffDay > 0){
            elem.innerHTML += ' (+'+diffDay+' day)';
        }
        lastDT = sessionStartDT;
    }
}

function formatScheduleList(list, timezone = 'local'){
    var lastDT = null;
    var sessionElems = list.querySelectorAll('*[data-start-at]');
    for(var elem of sessionElems){
        var sessionStartDT = DateTime.fromISO(elem.getAttribute('data-start-at')).setZone(timezone);
        var sessionEndDT = DateTime.fromISO(elem.getAttribute('data-end-at')).setZone(timezone);

        elem.innerHTML = sessionStartDT.toLocaleString(timeOptions) +" - "+ sessionEndDT.toLocaleString(timeOptions);
        var diffDay = sessionEndDT.get('day') - sessionStartDT.get('day');
        if(diffDay > 0){
            elem.innerHTML += ' (+'+diffDay+' day)';
        }
        lastDT = sessionStartDT;
    }
}

function showTimezoneInfo(container, timezone = 'local'){
    var scheduleTzInfo = container.getElementsByClassName('schedule-tz-info');
    while (scheduleTzInfo.length > 0) scheduleTzInfo[0].remove();
    var tz = DateTime.now().setZone(timezone).zoneName;
    var tzSmallNode = document.createElement('small');
    var tzStr = (tz == DateTime.now().zoneName) ? 'your local' : '';
    var tzTextNode = document.createTextNode('All sessions are shown in '+ tzStr + ' timezone: ');
    tzSmallNode.appendChild(tzTextNode);
    tzSmallNode.classList.add('schedule-tz-info');
    container.insertBefore(tzSmallNode, container.childNodes[0]);
}

function createTimeZoneSelect(fn){
    tzNode = timezoneSelect();
    tzNode.style.fontSize = 'initial';
    tzNode.addEventListener('change', fn);
    return tzNode;
}

function createButton(text, fn, classes = null){
    var btn = document.createElement('button');
    btn.innerHTML = text;
    classes = classes || ['btn', 'btn--primary'];
    for(var _class of classes){
        btn.classList.add(_class);
    }
    btn.onclick = fn;
    return btn;
}

function formatScheduleAndShowTimeZoneAndSelect(elem, { timezone = 'local-storage', type = 'table' }={}){
    if(timezone == 'local-storage'){
        var timezone = localStorage.getItem("timezone") || 'local';
    }

    var tzPNode = document.createElement('p');
    container = elem.parentNode;
    container.insertBefore(tzPNode, container.childNodes[0]);

    var tzSelectNode = null;
    var tzClearBtn = null;

    function show(timezone){
        var timezone = DateTime.now().setZone(timezone).zoneName;

        if(type == 'table'){
            formatSchedule(elem, timezone);
        } else {
            formatScheduleList(elem, timezone);
        }
        showTimezoneInfo(tzPNode, timezone);

        if(tzClearBtn != null) tzClearBtn.remove();
        if(timezone != DateTime.now().zoneName){
            tzClearBtn = createButton('&#9003;', function(){
                show("local");
            }, ['btn', 'btn--primary', 'btn--small', 'btn--danger']);
            tzPNode.append(tzClearBtn);
        }

        tzSelectNode.value = timezone;
        localStorage.setItem("timezone", timezone);
    }

    tzSelectNode = createTimeZoneSelect(function(){
        show(this.value);
    });
    tzPNode.append(tzSelectNode);

    show(timezone);
}