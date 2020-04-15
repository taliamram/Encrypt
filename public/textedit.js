

let UserStr = [];

let encryptStr = [];
let decryptStr = [];
let sendStr = [];
let colors = [];
let maxDistance;
let spacer;
let SqSize;
let StrIndex=0;
let DrawIndex=0;
let Xstart;
let Ystart;
let row;
let column;
let KeyLen;
let KeyWord;// = 'apple';
let orderOfletters;
let displayInputBox;
let inputCompleted;
let state;
let recivedStr;
let columnLen;
let  buttonKeyWord;
let greetingKeyWord;
let inputKeyWord;
let buttonMessage;
let greetingMessage;
let greetingError;
let inputMessage;
let sel;
let isreceiver;

function setup() {
	inputCompleted = false;
	
	createCanvas(window.innerWidth, window.innerHeight);//(windowWidth, windowHeight);
	
	socket = io.connect('http://127.0.0.1:3000');
	socket.on('encriptedMessage',decriptMessage);
	socket.on('KeyWord',updateKeyWord);
	stroke(20);      
	SqSize = windowHeight/20;
	Xstart = SqSize;
	Ystart = SqSize;
	isreceiver = false;
   row=0;
   column=0;
   state = 'nostate';
   frameRate(14);
   colors = ["red",  "yellow", "orange","Cyan","Purple","blue", "green","gray"];
	inputKeywordBox();
  	noLoop();
}


function draw() {
	if(state == 'DrawKeyword'){
		
		if(StrIndex<KeyWord.length)
			drawKeyword (KeyWord);
		else
		{
			row=0;
			column=0;
			StrIndex=0;
			sortKeyWord();
			drawKeywordNum();
			inputSentenceBox();
			noLoop();
		}
	}
	else if(state == 'encrypt'){
		if(UserStr.length > 0){
		if(StrIndex<UserStr.length)
			drawOrigin(UserStr);
		else
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
		  else
		  {
		   	drawEncryptedOrdered();
		  	noLoop();
		  }
		}
		}
	}
	else if(state == 'decrypt'){
		if(recivedStr.length > 0){
			if(StrIndex<recivedStr.length)
				drawDecrypt(recivedStr);
			else
			{
				decryptStr = decryptStr.join("");
				textAlign(LEFT);
				textSize(SqSize/2);
				
				text("the message is: \n" + decryptStr, SqSize, Ystart+(SqSize*(columnLen+2)),SqSize); 
				if(decryptStr.includes(UserStr) == true)
				{
					fill("green");
					text("VERY GOOD !!! your guess was correct \n",windowWidth/2, windowHeight/2,SqSize); 
				}
				else
				{
					fill("red");
					text(" :( bad guess \n",windowWidth/2, windowHeight/2,SqSize);
				}

			  	noLoop();
			}
		}
	}
	else{
		noLoop();
	}
}
 
function updateKeyWord(data) {
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
	background("pink"); // Set the background to white
	state = 'DrawKeyword';
	loop();
 } 
function decriptMessage (data) {
		recivedStr = data;
		Xstart = SqSize;
		Ystart = SqSize*2;
		textSize(SqSize/2);
		textAlign(LEFT);
		greetingMessage.remove();
		text("got encrypted message :" + data, Xstart, Ystart); // Text wraps within text box
		StrIndex=0;
		DrawIndex=0;
		Xstart = SqSize;
		Ystart = SqSize*4;
		row=0;
		isreceiver = true;
		//buttonMessage.hide();
		greetingMessage.remove();
		//inputMessage.remove();
		//sel.remove();
		//state = 'decrypt';
		//loop();
}
		
function drawKeyword (stringToDraw) {
	column = DrawIndex%KeyLen;
	 fill(colors[column]);	  
	 rect(Xstart, Ystart, SqSize, SqSize);
	 fill(50);
	 textSize(SqSize);
	 textAlign(CENTER, CENTER);
	 let currChar = stringToDraw[StrIndex];
	 if(currChar != ' ')
	 {
	   text(currChar, Xstart, Ystart+(SqSize/2),SqSize); // Text wraps within text box
	   StrIndex++;
	   DrawIndex++;
	   Xstart+=SqSize;
	 }
}
	  
function drawOrigin (stringToDraw) {

	 column = DrawIndex%KeyLen;
	 
	  fill(colors[column]);	  
	  
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


function drawDecrypt (stringToDraw) {
	
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

function drawEncryptedOrdered () {

		//Ystart += SqSize;
		let xx=0;
		textSize(SqSize/2);
		for(let k=0;k<KeyLen ;k++)
		{
			encryptStr[orderOfletters[k]] = encryptStr[orderOfletters[k]].join("");
			Ystart += SqSize/2;
			textAlign(LEFT);
			fill(colors[orderOfletters[k]]);	
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
		socket.emit('encriptedMessage',sendStr);
		noLoop();
}


function drawKeywordNum () {
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

function sortKeyWord () {
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

function inputKeywordBox () {	
	inputKeyWord = createInput();
	inputKeyWord.size(60);
	inputKeyWord.position(Xstart , Ystart);
	buttonKeyWord = createButton('submit');
  	buttonKeyWord.position(inputKeyWord.x + inputKeyWord.width, Ystart);
  	greetingKeyWord = createElement('h2', 'Enter your keyword:');
  	greetingKeyWord.position(inputKeyWord.x, inputKeyWord.y-50);
  	buttonKeyWord.mousePressed(getKeyword);
}

function getKeyword () {
	if(greetingError)
    	greetingError.remove();	
	KeyWord = inputKeyWord.value();
	KeyWord = trim(KeyWord); // remove space from begining and end of string
	KeyWord = KeyWord.toUpperCase(); // make all chat uper case - Big letters
	KeyLen = KeyWord.length;
	if(KeyWord.match("^[a-zA-Z]*$")) // make sure that oly alpha beit is inserted 
	{
		if(KeyLen > 2 && KeyLen <=7 )
		{
			buttonKeyWord.hide();
			greetingKeyWord.remove();
			inputKeyWord.remove();
			socket.emit('KeyWord',KeyWord);
			Xstart = SqSize;
			Ystart = SqSize-(SqSize/4);
			row=0;
			column=0;
			StrIndex=0;
			background("Green"); // Set the background to 
			state= 'DrawKeyword';
			loop();
		}
		
	}
	else
	{ 
		greetingError = createElement('h2', 'keyword can be only A-Z a-z and 3-7 length');
		greetingError.position(inputKeyWord.x, inputKeyWord.y+20);
	}
}

function inputSentenceBox () {
	Xstart = SqSize;
	Ystart = 2.5*SqSize;
	inputMessage = createInput();
	inputMessage.size(300);
	inputMessage.position(Xstart , Ystart);
	inputMessage.size = 400;
 	buttonMessage = createButton('submit');
	buttonMessage.position(inputMessage.x + inputMessage.width, inputMessage.y);
	greetingMessage = createElement('h2', 'enter sentence to encrypt');
	greetingMessage.position(inputMessage.x, inputMessage.y-50);
	buttonMessage.mousePressed(getSentece);
	inputSentenceDropDownBox();
}

function getSentece () {
	UserStr = inputMessage.value();
	UserStr= trim(UserStr);
	processUserStr();
}


function inputSentenceDropDownBox() {
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
	sel.changed(SelectEvent);
  }
  
  function SelectEvent() {
	UserStr =  sel.value();
	
	processUserStr();
  }

  function processUserStr() {
  if(isreceiver == false)  
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
		state= 'encrypt';
		loop();
	}
  }
  else
  {
	  UserStr= trim(UserStr);
	  UserStr = UserStr.replace(/\s/g, ''); // remove all spaces in user guess string 
	  state = 'decrypt';
	  loop();
  }
}