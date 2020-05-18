//רשימת משתנים גלובלים לשימוש בין הפונקציות השונות
let UserStr = []; //המחרוזת שמחזיקה את המשפט שמיועד להצפנה/פענוח תלוי במצב במכונת המצבים

let encryptStr = []; //המשפט לאחר ההצפנה
let decryptStr = []; // המשפט לאחר הפענוח
let sendStr = []; // המשפט המפוענח
let colors = []; // מערך המחזיר צבעים- כל עמודה בעלת צבע אחד
let SqSize; //מגדיר מהו גודל כל ריבוע ופיקסלים
let StrIndex=0; // המצביע על המיקום הנוכחי במחרוזת
let DrawIndex=0; // מצביע על המיקום הנוכחי בציור הטבלה
let Xstart; //קורדינטה המציעה על קודקוד הציור בציר האיקס
let Ystart; //yקורדינטה המציעה על קודקוד הציור בציר ה
let row; //מציין את מספר השורה הנוכחית
let column;//מציין את מספר העמודה הנוכחי
let KeyLen; //מציין את אורך מילת המפתח
let KeyWord;// = 'apple' מחזיק את מילת המפתח
let orderOfletters; //מערך המחזיק את סדר מילת המפתח לפי הא-ב
let state; //מחזיק את המצב הנוכחי של מכונת המצבים
let recivedStr; //המחרוזת שהגיעה מהסוקט
let columnLen; //אורך כל תור(מספר השורות)
let buttonKeyWord; //מצביע על הכפתור שמשמש למילת המפתח
let greetingKeyWord; //מצביע להודעה של הכנסת מילת מפתח
let inputKeyWord; //מצביע לתיבת הקלט של מילת הקוד
let buttonMessage; //מצביע כל כפתור המשמש לקליטת המשפט להצפנה
let greetingMessage; //מצביע להודעה של הכנסת משפט להצפנה
let greetingError; //לא בשימוש 
let inputMessage; //מצביע לתיבת הקלט של המשפט 
let sel; // מצביע על מאגר המשפטים
let isreceiver; //דגל שמסמל אם התוכנית במצב של מצפין ההודעה או מפענח

function setup() { //נקרא פעם אחת בתחילת התוכנית על ידי p5JS
	
	createCanvas(window.innerWidth, window.innerHeight);//(windowWidth, windowHeight); 
	
	socket = io.connect('http://127.0.0.1:3000'); //פתיחת קשר עם השרת
	socket.on('encriptedMessage',decriptMessage); //האזנה להודעות מהשרת
	socket.on('KeyWord',updateKeyWord); //האזנה להודעות מהשרת
	stroke(20);      
	SqSize = windowHeight/20;
	Xstart = SqSize;
	Ystart = SqSize;
	isreceiver = false;
   row=0;
   column=0;
   state = 'nostate';
   frameRate(14);
   colors = ["red",  "yellow", "orange","Cyan","Purple","blue", "green","gray"]; //קביעת הצבעים
	inputKeywordBox(); //קפיצה לפעולה המטפלת בקלט מילת המפתח 
  	noLoop();
}


function draw() { //נקרא על ידי p5Js כל פעם שהתוכנית במצה loop איקס פעמים בשנייה
	if(state == 'DrawKeyword'){ //מצב של קבלת מילת מפתח
		
		if(StrIndex<KeyWord.length) //מצייר את מילת המפתח 
			drawKeyword (KeyWord);
		else // סיים ועובר לשלב הבא
		{
			row=0;
			column=0;
			StrIndex=0;
			sortKeyWord(); //מיון לוגי של מילת המפתח
			drawKeywordNum(); //הצגה גרפית של סדר הא-ב במשפט
			inputSentenceBox(); //מעבר לפונקציה שתשנה למצב הבא
			noLoop();
		}
	}
	else if(state == 'encrypt'){ //מצב של מצפין ההודעה
		if(UserStr.length > 0){ //מציג את המשפט בתוך טבלת העמודות
		if(StrIndex<UserStr.length)
			drawOrigin(UserStr);
		else //סיים להציג בטבלה ואם הטבלה לא התמלאה עד הסוף מוסיף x y z
		{
		
		  if(column != KeyLen-1) 
		  {
		   // StrIndex = StrIndex-(KeyLen-column-1);
		   let l = 'z'.charCodeAt(0) - (KeyLen-1-column);
		   for(i=0;i<KeyLen-1-column;i++)
		   {
			   UserStr += String.fromCharCode(l+i+1);
		   }
		  }
		  else // סיים למלא את הטבלה במלואה ועובר להציג את המשפטים לפי אופן ההצפנה
		  {
		   	drawEncryptedOrdered(); //מציג את המשפטים לפי הסדר הלוגי של העמודות -לב ההצפנה!
		  	noLoop();
		  }
		}
		}
	}
	else if(state == 'decrypt'){ //מצב מפענח
		if(recivedStr.length > 0){ //מצייר את המשפט המוצפן בטבלת הפענוח לפי עמודות ולפי סדר הא-ב 
			if(StrIndex<recivedStr.length)
				drawDecrypt(recivedStr);
			else//מפענח את המשפט המוצפן אחרי הצגתו בטבלה
			{
				decryptStr = decryptStr.join("");
				textAlign(LEFT);
				textSize(SqSize/2);
				
				text("the message is: \n" + decryptStr, SqSize, Ystart+(SqSize*(columnLen+2)),SqSize); //הצגת המשפט המקורי
				if(decryptStr.includes(UserStr) == true) //התראה קופצת למשתמש אם המשפט שהוא הכניס הוא גם המשפט המקורי
				{
					//fill("green");
					//text("VERY GOOD !!! your guess was correct \n",windowWidth/2, windowHeight/2,SqSize); 
					Swal.fire({
					position: 'center',
					icon: 'success',
					title: 'VERY GOOD !!! your guess is correct',
					showConfirmButton: false,
					//timer: 1500
				  	})
				}
				else // התראה קופצת שמודיעה למשתמש שהוא טעה בפענוח
				{
					//fill("red");
					//text(" :( bad guess \n",windowWidth/2, windowHeight/2,SqSize);
					Swal.fire({
						position: 'center',
						icon: 'error',
						title: ':( bad guess',
						showConfirmButton: false,
						//timer: 1500
						  })
				}

			  	noLoop();
			}
		}
	}
	else{
		noLoop();
	}
}
 
function updateKeyWord(data) { //לאחר קבלת הודעה מהשרת פעולה זו הופכת את המסך של המשתמש לורוד ומשנה את המצב במכונת המצבים למצב המציג את מילת המפתח שנקלטה
 	KeyWord = data;
	KeyLen = KeyWord.length;
	Xstart = SqSize;
	Ystart = SqSize-(SqSize/4);
   	row=0;
	column=0;
	StrIndex=0;
	buttonKeyWord.hide();
	greetingKeyWord.remove();
	inputKeyWord.remove();
	background("pink"); // Set the background to pink
	state = 'DrawKeyword'; // שינוי מצב לציור מילת הקוד
	loop(); //קיראה לdraw
 } 
function decriptMessage (data) {//לאחר קבלת המשפט המוצפן מהשרת פונקציה זו מתריאה על קבלת הודעה ומשנה את הדגל למצב מקבל ההודעה
		recivedStr = data;
		Xstart = SqSize;
		Ystart = SqSize*2;
		textSize(SqSize/2);
		textAlign(LEFT);
		greetingMessage.remove(); //מחיקת ההודעה לבקשת קלט מהמשתמש
		fill("black");
		text("got encrypted message :" + data, Xstart, Ystart); // Text wraps within text box
		Swal.fire({ //התראה שקופצת ומבשרת על קבלת משפט ממשתמש אחד
			position: 'center',
			icon: 'info',
			title: 'got encrypted message :' + data,
			showConfirmButton: false,
			timer: 2500
			  })
		StrIndex=0;
		DrawIndex=0;
		Xstart = SqSize;
		Ystart = SqSize*4;
		row=0;
		isreceiver = true; //שינוי הדגל למצב מקבל ההודעה ולא מצפין ההודעה
		//buttonMessage.hide();
		greetingMessage.remove();
		//inputMessage.remove();
		//sel.remove();
		//state = 'decrypt';
		//loop();
}
		
function drawKeyword (stringToDraw) { //מצייר לפי צבעים את מילת הקוד
	column = DrawIndex%KeyLen;
	 fill(colors[column]);	  
	 rect(Xstart, Ystart, SqSize, SqSize);
	 fill(50);
	 textSize(SqSize);
	 textAlign(CENTER, CENTER);
	 let currChar = stringToDraw[StrIndex];
	 if(currChar != ' ') //לא יקרה מצב שבו יהיה רווח כי עשיתי בדיקה כזו בהכנסת הקלט
	 {
	   text(currChar, Xstart, Ystart+(SqSize/2),SqSize); // Text wraps within text box
	   StrIndex++;
	   DrawIndex++;
	   Xstart+=SqSize;
	 }
}
	  
function drawOrigin (stringToDraw) { //מצייר את המשפט המקורי בטבלה מסודרת לפי הא-ב של מילת המפתח 

	 column = DrawIndex%KeyLen;
	 
	  fill(colors[column]);	//צבעים  
	  
	  let currChar = stringToDraw[StrIndex];
	  if(currChar != ' ')
	  {
		rect(Xstart, Ystart, SqSize, SqSize);
		fill(50);
		textSize(SqSize);
		textAlign(CENTER, CENTER);
		text(currChar, Xstart, Ystart+(SqSize/2),SqSize); // Text wraps within text box
		encryptStr[column][row]=currChar;
		StrIndex++;
		DrawIndex++;
		Xstart+=SqSize;
		if(DrawIndex%KeyLen==0)
		{
		  Xstart = SqSize;
		  Ystart += SqSize;
		  row++;
		}
	  }
	  else
	  {
		StrIndex++;
	  }
}


function drawDecrypt (stringToDraw) { //מציג בטבלה בצורה גרפית לפי צבעים ולפי סדר התורים לפי הא-ב את הצפנת המשפט
	
	//column = DrawIndex%KeyLen;
	columnLen = stringToDraw.length/KeyLen;
	let col =  Math.floor(StrIndex/columnLen);
	if(col >= KeyLen)
	   console.log(stringToDraw);
	column = orderOfletters[col];
	fill(colors[column]);	  
	rect(Xstart+(SqSize*column), Ystart, SqSize, SqSize);
	fill(50);
	textSize(SqSize);
	textAlign(LEFT, LEFT);
	//textAlign(CENTER, CENTER);
	let currChar = stringToDraw[StrIndex]; 
	text(currChar, Xstart+(SqSize*column), Ystart,SqSize); // Text wraps within text box
	decryptStr[column+(row*KeyLen)]=currChar;
	StrIndex++;
	Ystart+=SqSize;
	row++;
	if(StrIndex%columnLen==0)
	{
		row=0;
		Ystart = 4*SqSize;
		
	}
}

function drawEncryptedOrdered () { //מציג את המשפטים בשורות לפי הסדר הלוגי של העמודות -לב ההצפנה

		//Ystart += SqSize;
		let xx=0;
		textSize(SqSize/2);
		for(let k=0;k<KeyLen ;k++)
		{
			encryptStr[orderOfletters[k]] = encryptStr[orderOfletters[k]].join("");
			Ystart += SqSize/2;
			textAlign(LEFT);
			fill(colors[orderOfletters[k]]); //צובע כל שורה בצבע המתאים להבנת ההצפנה	
			text( encryptStr[orderOfletters[k]], Xstart, Ystart+(SqSize/2),SqSize);
			for(let y=0 ; y < encryptStr[k].length ; y++)
			{
				sendStr[xx]= encryptStr[orderOfletters[k]][y];
				xx++;
			}
		}
		Xstart = SqSize;
		textSize(SqSize/2);
		sendStr = sendStr.join("");
		Ystart += SqSize;
		textAlign(LEFT);
		text( sendStr, Xstart, Ystart+(SqSize/2));
		StrIndex=0;
		DrawIndex=0;
		row=0;
		column=0;
		drawKeywordNum();
		isreceiver = false;
		socket.emit('encriptedMessage',sendStr); //שולח את ההודעה המוצפנת על גבי הסוקט לשרת
		noLoop();
}


function drawKeywordNum () { //מציג על גבי מילת הקוד את סדר הא-ב להצפנה קלה יותר
	column = DrawIndex%KeyLen;
	Xstart = SqSize;
	Ystart = SqSize-(SqSize/4);
	fill("white");
    textSize(SqSize/2);
    textAlign(RIGHT, TOP);
    for(let k=0;k<KeyLen ;k++)
	{
		let currChar = k+1;
		text(currChar, Xstart+(orderOfletters[k]*SqSize), Ystart+(SqSize/2),SqSize); // Text wraps within text box
	}
}

function sortKeyWord () { //יצירת מערך שישמור את סדר הא-ב במילת המפתח
	orderOfletters = new Array(KeyLen);
	var k=0;
	for(let i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); i++){
		var currentChar = String.fromCharCode(i);
		if(KeyWord.includes(currentChar)){
			for (j=0; j<KeyLen; j++) {
				if(KeyWord[j] == currentChar){
					orderOfletters[k] = j;
					k++;
				}

			}
		}
	}
}

function inputKeywordBox () { //יצירת כפתור ותיבת קלט למילת הקוד	
	inputKeyWord = createInput(); //תיבת טקסט
	inputKeyWord.size(60);
	inputKeyWord.position(Xstart , Ystart);
	buttonKeyWord = createButton('submit'); //כפתור
  	buttonKeyWord.position(inputKeyWord.x + inputKeyWord.width, Ystart);
  	greetingKeyWord = createElement('h2', 'Enter your keyword:'); //הוראה למשתמש
  	greetingKeyWord.position(inputKeyWord.x, inputKeyWord.y-50);
  	buttonKeyWord.mousePressed(getKeyword); //כאשר יש לחיצה על הכפתור קריאה לפעולה הבאה
}

function getKeyword () { //לאחר קבלת קלט של מילת קוד הפעולה עוברת למצב הראשון במכונת המצבים, שולחת את מילת הקלט לשאר המשתמשים ומשנה את צבע המסך של השולח לירוק
	if(greetingError) //לא בשימוש
    	greetingError.remove();	
	KeyWord = inputKeyWord.value();
	KeyWord = trim(KeyWord); // remove space from begining and end of string
	KeyWord = KeyWord.toUpperCase(); // make all chat uper case - Big letters
	KeyLen = KeyWord.length;
	if(KeyWord.match("^[a-zA-Z]*$")) // make sure that oly alpha beit is inserted 
	{
		if(KeyLen > 2 && KeyLen <=7 ) //תנאי המכריח את מילת הקלט להיות בין2 ל7 תווים
		{
			buttonKeyWord.hide();
			greetingKeyWord.remove();
			inputKeyWord.remove();
			socket.emit('KeyWord',KeyWord); //שליחת מילת המפתח לשאר המשתמשים דרך השרת
			Xstart = SqSize;
			Ystart = SqSize-(SqSize/4);
			row=0;
			column=0;
			StrIndex=0;
			background("Green"); // Set the background to green
			state= 'DrawKeyword'; //המצב הראשון במכונת מצבים-מצב הצגת מילת הקלט
			loop();
		}
		else //כאשר התנאי לא מתקיים קופצת התראה למשתמש שהקלט אינו תקין עם הסבר מהו קלט תקין
		Swal.fire({position: 'top',title: 'keyword length can be 3-7 characters'}); 
		
	}
	else //התראה למשתמש על קלט אינו תקין והסבר מהו קלט תקין
	{ 
		Swal.fire({position: 'top',title: 'keyword can be only A-Z a-z and 3-7 characters length'});
	
		//greetingError = createElement('h2', 'keyword can be only A-Z a-z and 3-7 length');
		//greetingError.position(inputKeyWord.x, inputKeyWord.y+20);
	}
}

function inputSentenceBox () { //יצירת תיבת טקסט להכנסת משפט להצפנה וכפתור 
	Xstart = SqSize;
	Ystart = 2.5*SqSize;
	inputMessage = createInput(); //יצירת תיבת קלט
	inputMessage.size(300);
	inputMessage.position(Xstart , Ystart);
	inputMessage.size = 400;
 	buttonMessage = createButton('submit'); //יצירת כפתור
	buttonMessage.position(inputMessage.x + inputMessage.width, inputMessage.y);
	greetingMessage = createElement('h2', 'enter sentence to encrypt');
	greetingMessage.position(inputMessage.x, inputMessage.y-50);
	buttonMessage.mousePressed(getSentece); //אם לוחצים על הכפתור אחרי הכנסת משפט בתיבת הקלט עובר לפעולה הבאה
	inputSentenceDropDownBox(); // אם המשתמש לא לוחץ על הכפתור ובוחר משפט ממאגר המשפטים עובר לפעולה הבאה
}

function getSentece () { //טיפול במשפט מתיבת הקלט או של המצפין או של המפענח תלוי במצב במכונת המצבים
	UserStr = inputMessage.value();
	UserStr= trim(UserStr);// מחיקת רווחים מתחילת המשפט ומסופו
	processUserStr(); //טיפול בקלט המשתמש
}


function inputSentenceDropDownBox() { //יצירת אפשרות בחירת משפט ממאגר משפטים או של המצפין או של המפענח תלוי במצב במכונת המצבים
	textAlign(CENTER);
	Xstart = SqSize;
	sel = createSelect();
	sel.position(Xstart , Ystart+(SqSize/2));
	sel.option("-----------------or select one from below ---------------------");
	sel.option("Nothing shows a man's character more than what he laughs at");
	sel.option("Life is like a mirror we get the best results when we smile at it");
	sel.option("If you want happiness for a lifetime help someone else");
	sel.option("The world is full of beautiful things including you");
	sel.option("i'm on a seafood diet i see food and i eat it");
	sel.option("My candle burns at both ends");
	sel.option("אתה לא יכול לטפס על סולם ההצלחה עם הידיים בכיס");
	sel.option("הגדרת המטרות היא הצעד הראשון בהפיכת הבלתי נראה לגלוי");
	sel.option("שום דבר לא יעבוד אם אתה לא תעבוד");
	sel.option("העבודה שלך הכי קלה, אתה בסך הכל צריך ללחוץ על כפתור");
	sel.changed(SelectEvent); //כאשר נבחר משפט מהמאגר
  }
  
  function SelectEvent() { // כאשר נבחר משפט ממכונת המצבים
	UserStr =  sel.value(); //הכנסת המשפט למשתנה המתאים
	
	processUserStr();//טיפול בקלט המשתמש
  }

  function processUserStr() { //עושה שני תפקידים- תלוי אם המשתמש הוא שולח ההודעה או מקבל ההודעה
  if(isreceiver == false)  //דגל=שולח ההודעה, משנה את מכונת המצבים למצב מצפין ויוצר מערך דו מימדי ריק 
  {
	if(UserStr.length > 2)
	{
		buttonMessage.hide();
		greetingMessage.remove();
		for (let x = 0; x < KeyLen; x++) {
			encryptStr[x] = []; // create nested array
			for (let y = 0; y <Math.ceil(UserStr.length/KeyLen); y++) 
				encryptStr[x][y] = "";
		}
		Ystart = 3.5*SqSize;
		state= 'encrypt'; //מצב מצפין
		loop();
	}
  }
  else //דגל= מקבל ההודעה, משנה את מכונת המצבים למצב מפענח ומוחק מהמשפט שהתקבל את הרווחים
  {
	  UserStr= trim(UserStr);
	  UserStr = UserStr.replace(/\s/g, ''); // remove all spaces in user guess string 
	  state = 'decrypt'; //מצב מפענח
	  loop();
  }
}