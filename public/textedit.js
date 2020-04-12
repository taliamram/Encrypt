

let UserStr = [];

let encriptStr = [];
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
function setup() {
	inputCompleted = false;
	
	createCanvas(window.innerWidth, window.innerHeight);//(windowWidth, windowHeight);
	
	socket = io.connect('http://127.0.0.1:3000');
	socket.on('encriptedMassage',decriptMessage);
	socket.on('KeyWord',updateKeyWord);
	stroke(20);      
	SqSize = windowHeight/20;
	Xstart = SqSize;
	Ystart = SqSize;
   row=0;
   column=0;
   frameRate(14);
   colors = ["red",  "yellow", "orange","Cyan","Purple","blue", "green","gray"];

	inputKeywordBox();
	//UserStr = 'The quick brown fox jumped over the lazy dog';
  	noLoop();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  SqSize = windowHeight/20;
}

function draw() {
	// if(displayInputBox){
	// 	inputKeywordBox();
	// 	inputSentenceBox();
	// 	displayInputBox = false;
	// }
	if(state == 'DrawKeyword'){
		
		if(StrIndex<KeyWord.length)
			drawKeyword (KeyWord);
		else
		{
			row=0;
			column=0;
			StrIndex=0;
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
		    StrIndex = StrIndex-(KeyLen-column-1);
		  }
		  else
		  {
		  	sortKeyWord();
		  	drawEncryptedOrdered();
		  	noLoop();
		  }
		}
		}
	}
	else if(state == 'decrypt'){
		if(recivedStr.length > 0){
			if(StrIndex<recivedStr.length)
				drawOrigin(recivedStr);
			else
			{
			
			  if(column != KeyLen-1)
			  {
			    StrIndex = StrIndex-(KeyLen-column-1);
			  }
			  else
			  {
			  	sortKeyWord();
			  	drawEncryptedOrdered();
			  	noLoop();
			  }
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
 } 
function decriptMessage (data) {
		recivedStr = data;
        Xstart = SqSize*6;
		Ystart = SqSize*5;
		textSize(SqSize/2);
		textAlign(LEFT);
		text( "Got an encrypted message! \n"+ recivedStr, Xstart + windowWidth/2, Ystart+(SqSize/2));
		StrIndex=0;
		DrawIndex=0;
		//KeyWord = 'mango';
		//KeyLen = KeyWord.length;
		Xstart = SqSize;
		Ystart = SqSize;
		row=0;
		state = 'decrypt';
		for (let x = 0; x < KeyLen; x++) {
		encriptStr[x] = []; // create nested array
		for (let y = 0; y <Math.ceil(recivedStr.length/KeyLen); y++) 
			encriptStr[x][y] = "";
    }
		loop();
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

	// return;
}
	  
function drawOrigin (stringToDraw) {

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
		encriptStr[column][row]=currChar;

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
		  StrIndex++;

	 // return;
}

function drawEncryptedOrdered () {
		
		Ystart += 2*SqSize;
		let xx=0;
		for(let k=0;k<KeyLen ;k++)
		{
			encriptStr[orderOfletters[k]] = encriptStr[orderOfletters[k]].join("");
			Ystart += SqSize;
			textAlign(LEFT);
			text( encriptStr[orderOfletters[k]], Xstart, Ystart+(SqSize/2),SqSize);
			for(let y=0 ; y < encriptStr[k].length ; y++)
			{
				sendStr[xx]= encriptStr[orderOfletters[k]][y];
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
		socket.emit('encriptedMassage',sendStr);
		noLoop();
	  
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
	
	
    input = createInput();
  	input.position(Xstart + 6*SqSize, Ystart);
 	button = createButton('submit');
  	button.position(input.x + input.width, Ystart);
  	greeting = createElement('h2', 'Enter your keyword:');
  	greeting.position(input.x, input.y-50);
  	button.mousePressed(getKeyword);
}

function getKeyword () {
	KeyWord = input.value();
	KeyWord = KeyWord.toUpperCase();
	KeyLen = KeyWord.length;
	socket.emit('KeyWord',KeyWord);
	Xstart = SqSize;
	Ystart = SqSize-4;
   	row=0;
	column=0;
	StrIndex=0;
	state= 'DrawKeyword';
	loop();
	//inputSentenceBox();
}
function inputSentenceBox () {
	Xstart = SqSize;
	Ystart = 2*SqSize;
  	input = createInput();
  	input.position(Xstart + 6*SqSize, Ystart + 3*SqSize);
 	button = createButton('submit');
  	button.position(input.x + input.width, input.y);
  	greeting = createElement('h2', 'Now enter the sentence you want to encrypt:');
  	greeting.position(input.x, input.y-50);
	button.mousePressed(getSentece);
   
}
function getSentece () {
	UserStr = input.value();
	for (let x = 0; x < KeyLen; x++) {
		encriptStr[x] = []; // create nested array
		for (let y = 0; y <Math.ceil(UserStr.length/KeyLen); y++) 
			encriptStr[x][y] = "";
	}
	state= 'encrypt';
    loop();
	
}




