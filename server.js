
var express = require ('express'); //שימוש בטכנולוגית node JS express.

var app= express(); //יצירית אובייקט מסוג אקספרס שיוצר את הסרבר באופן מהיר ואוטמטי
var server= app.listen(3000); //האנזנה לפורט 3000 (הקוד בדיגיטל אושן מאזין לפורט 80)

app.use(express.static('public')); //הפנייה לתת ספרייה public המכילה את קובץ האייץ טי אמ אל והגאווה סקריפט

console.log("Tali pogram"); //הדפסה למסך שמסמל לי שהסרבר התחיל לרוץ

var socket =require('socket.io'); //שיומוש בספרייה

var io = socket(server); //האזנה לסוקט

io.sockets.on('connection', newTaliConnection); //הפעולה שתתבצע כל פעם שיש חיבור של משתמש חדש

function newTaliConnection (socket) { //חיבור של משתמש
  console.log("new connection:" + socket.id); //הדפסה ללוג

 socket.on('mouse-out', mouseMsg); //דוגמא שלמדתי ממנה

socket.on('encriptedMessage', stringMsg); //קפיצה לפונקציה כל פעם שמגיעה הודעה עם הכותרת הרשומה
socket.on('KeyWord', updateKeyWord); 


function stringMsg (data) { 
	socket.broadcast.emit('encriptedMessage',data); //שולח לכל המשתמשים לא כולל שולח ההודעה עצמו 
	console.log(data);
}

 function mouseMsg (data) {
 	socket.broadcast.emit('mouse-in', data);
 	//io.sockets.emit('mouse', data); שולח לכל המשתמשים כולל שולח ההודעה
 	//console.log(data);
 }
 function updateKeyWord(data) {
 	socket.broadcast.emit('KeyWord', data);
 	 console.log("KeyWord was exchanged : " + data);

 }


}