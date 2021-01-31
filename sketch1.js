var player1;
var player2;
var ball;
var goal1,goal2;
var p1Score,p2Score;
var car10,ballimg;
var ground,ground2;
var database;
var position;
var ballHitSound,jumpSound,goalSound;
var timer = 5;

function preload(){
    
  //loading images
  car1 = loadImage("car10.png");
  ballimg = loadImage("Ball.png")
  backroundimg = loadImage("backround.jpg");
  goalimg = loadImage("goal.png")

  //loading sounds
  ballHitSound = loadSound("sounds2/ballHitSound.mp3")
  jumpSound = loadSound("sounds2/jumpSound.mp3")
  goalSound = loadSound("sounds2/goalSound.mp3")

}
  
function setup() {    
  createCanvas(displayWidth-20,displayHeight-30);

  //Adding goals in the grouns to the left and right sides
  goal1 = createSprite(50,displayHeight-220,50,50)
  goal1.addImage(goalimg)
  goal1.mirrorX(goal1.mirrorX() * (-1));
  goal1.scale=0.2
  
  goal2 = createSprite(displayWidth-50,displayHeight-220,50,50)
  goal2.addImage(goalimg)
  goal2.scale=0.2

  //create player1 in the game(to the right)
  player1 = createSprite(displayWidth-100,displayHeight-120,10,70);
  player1.addImage(car1);
  player1.scale = 0.1;
  player1.setCollider("rectangle",0,0,1000,500)
  // player1.debug = true;
      
  //create player2 in the game(to the left)
  player2 = createSprite(90,displayHeight-120,10,70);
  player2.addImage(car1);
  player2.scale = 0.1;
  player2.mirrorX(player2.mirrorX() * (-1));
  player2.setCollider("rectangle",0,0,1000,500);
  
  //create the soccer ball
  ball = createSprite(displayWidth/2,displayHeight-140,12,12);
  ball.addImage(ballimg);
  ball.scale = 0.035;

  //Adusting the boundaries for the ball and players
  ground = createSprite(displayWidth/2,displayHeight -120,displayWidth,10)
  ground.visible = false;

  ground2 = createSprite(displayWidth/2,displayHeight/2,displayWidth,10)
  ground2.visible = false;

  //creating edges
  edges = createEdgeSprites();

  //Initilaizing the scores for players
  p2Score = 0;
  p1Score = 0;

  //Initializing the gamestate
  gameState = "serve";

}
  
function draw() {  
    
  background(backroundimg);

  
  //Making the players velocity zero to avoaid moving continuously
  player1.velocityX = 0;
  player1.velocityY = 0;
  player2.velocityX = 0;
  player2.velocityY = 0;    
    
  //display Scores
  textSize(20)
  stroke("white")
  text(p2Score,displayWidth/2-50,20);
  text(p1Score, displayWidth/2+50,20);
    
  //Make the players collide wit the ground
  player1.collide(ground);
  player2.collide(ground);
  player1.bounce(player2);

    //draw dotted lines
    // for (var i = 0; i < displayHeight; i+=20) {
    //    line(displayWidth/2,i,displayWidth/2,i+10);
    // }
 
  if (gameState === "serve") {
    text("Press Space to Serve",displayWidth/2-100,displayHeight/2-50);
  }

  if (keyDown("space") && gameState == "serve") {
    ball.velocityX = random(10,-10);
    ball.velocityY = random(-5,5)
    gameState = "play";
  }
  
  //give velocity to the ball when the user presses play
  //assign random velocities later for fun
  if(gameState === "play"){
    if (player2.isTouching(ball) || player1.isTouching(ball)) {
      ball.velocityX = random(10,-10);
      ball.velocityY = random(-5,-10)      
    }
  }

  
  //Adding controls to the player
  if(keyDown("RIGHT_ARROW")){
    player1.velocityX = 5;
  }

  if(keyDown("LEFT_ARROW")){
    player1.velocityX = -5;
  }

  if(keyDown("UP_ARROW") && player1.y > displayHeight- 300){
    player1.velocityY = -40;
    jumpSound.play();
  }
    
  //Adding gravity to player1
  player1.velocityY = player1.velocityY + 10;

  if(keyDown("D")){
    player2.velocityX = 5;
  }

  if(keyDown("A")){
    player2.velocityX = -5;
  }

  if(keyDown("W") && player2.y > displayHeight- 300){
    player2.velocityY = -40;
    jumpSound.play();
  }
  
  //Adding gravity to player1
  player2.velocityY = player2.velocityY + 10;
  
  //make the ball bounce off the top and bottom walls
  if (ball.isTouching(ground2) || ball.isTouching(ground)) {
    ball.bounceOff(ground2);
    ball.bounceOff(ground);
  }
  //make the ball bounce off the players
  if(ball.isTouching(player1)){
    ballHitSound.play();
    ball.x = ball.x - 5;
    ball.velocityX = -ball.velocityX;  
  }
  
  if(ball.isTouching(player2)){
    ballHitSound.play();
    ball.x = ball.x + 5;
    ball.velocityX = -ball.velocityX;
  }
  
  if(gameState === "play"){
    textSize(30);
  fill("white");
  if (frameCount % 30 === 0 && timer > 0) { 
    text(timer, displayWidth-100, 100);
    // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer --;
  }
    text(timer, displayWidth-100, 100);

  }
  //place the ball back in the centre if it crosses the screen
  if(ball.isTouching(goal1) || ball.isTouching(goal2)){    
    if (ball.isTouching(goal2)) {
      p2Score++;
      goalSound.play();
    }
    else if(ball.isTouching(goal1)) {
      p1Score++;
      goalSound.play();
    }
  
    reset();  
    gameState = "serve";
  
  // if (p2Score=== 5 || p1Score === 5){
  //   gameState = "over";
  // }
  }

  if(timer === 0 ){
    gameState = "over";
    
  }

  if (gameState === "over" ) {
    textSize(30);
    text("GAME OVER!",displayWidth/2-100,displayHeight/2-200);
    text("Press 'R' to Restart",displayWidth/2-100,displayHeight/2-100);
    if(p1score>p2score){
      text("PLAYER1 WINS",displayWidth/2-100,displayHeight/2-400)
    }
    if(p2score>p1score){
      text("PLAYER2 WINS",displayWidth/2-100,displayHeight/2-400)
    }
    if(p2score === p1score){
      text("ITS A TIE",displayWidth/2-100,displayHeight/2-400)
    }
  }


    if (keyDown("R") && gameState === "over") {
      gameState = "serve";
      p2Score = 0;
      p1Score = 0;
    }
    
  drawSprites();
   
  }

 function reset(){
  ball.x = displayWidth/2;
  ball.y = displayHeight-150;
  ball.velocityX = 0;
  ball.velocityY = 0;
  
  player1.x = displayWidth-100;
  player1.y = displayHeight-150;
  player2.x = 90;
  player2.y = displayHeight-150;
 }