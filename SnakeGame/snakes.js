const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");
var bestscore=0;

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "ground.png";

const foodImg = new Image();
foodImg.src = "food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "dead.mp3";
eat.src = "eat.mp3";
up.src = "up.mp3";
right.src = "right.mp3";
left.src = "left.mp3";
down.src = "down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;


//control the snake

let d;

document.addEventListener("keydown",direction);

function getStoredScore()
{
	if(!localStorage.bestscore)
	{
		localStorage.bestscore = JSON.stringify(0);
	}
	else
	{
		bestscore = JSON.parse(localStorage.bestScore);
	}
}
function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "red" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
		ctx.fillStyle = "darkgreen";
		ctx.font = "75px exo";
		ctx.fillText("Game Over",140,300);
	
		ctx.font = "25px Exo";
		ctx.fillText("Press F5 to play again",200,330);
        dead.play();
    }
    
    snake.unshift(newHead);
    
	//score
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);

	//best
	ctx.font = "35px Changa one";
	ctx.fillText("Best",14*box,1.6*box);
	ctx.fillText(bestscore,16.5*box,1.6*box);
	if(score>bestscore)
	{
		bestscore = score;
	}
	storeScore();
	
}
function storeScore()
{
	localStorage.bestScore = bestscore;
}
// call draw function every 100 ms

let game = setInterval(draw,100);