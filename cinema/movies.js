
var dateObj = new Date("Oct 4, 2023 17:00:00")
var countDownDate = dateObj.getTime();

var dateCode = dateObj.getDay();
switch (dateCode){
  case 0:
    dateCode = "Sonntag";
    break;
  case 1:
    dateCode = "Montag";
    break;
  case 2:
    dateCode = "Dienstag";
    break;
  case 3:
    dateCode = "Mittwoch";
    break;
  case 4:
    dateCode = "Donnerstag";
    break;
  case 5:
    dateCode = "Freitag";
    break;
  case 6:
    dateCode = "Samstag";
    break;
}
document.getElementById('movieDay').innerHTML = dateCode;

var x = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var d = "0"
  if(days >= 10){
    d = ""
  }
  var h = "0"
  if (hours >= 10) {
    h = ""
  }
  var m = "0"
  if (minutes >= 10) {
    m = ""
  }
  var s = "0"
  if (seconds >= 10) {
    s = ""
  }

  document.getElementById("timer").innerHTML = d + days + "d " + h + hours + "h "
    + m + minutes + "m " + s + seconds + "s ";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "L Ä U F T";
  }
}, 1000);


