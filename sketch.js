var ply,asts,coin,life=3;
//var edges=[];
var gameState=-1;
var score=0,noCoins=0;
var plyState=0,disLeft;

function preload(){
  ast1Img=loadImage("ast1.png");
  ast2Img=loadImage("ast2.png");
  ast3Img=loadImage("ast3.png");
  ast4Img=loadImage("ast4.png");
  bg=loadImage("bg.jpg");

  explosionAni=loadAnimation("exp1.png","exp2.png","exp3.png","exp4.png","exp5.png");

  explode=loadSound("explode.mp3");

  win=loadSound("win.mp3");

  lifeImg=loadImage("life.png");
  coinImg=loadImage("coin.png");
  ply1=loadImage("spaceShip1.png");
  ply2=loadImage("spaceShip2.png");
}

function setup() {
  createCanvas(displayWidth,displayHeight-150);

  //edges=createEdgeSprites();

  asts=new Group();
  coins=new Group();

  ply=createSprite(displayWidth/2,displayHeight-300);
  if(plyState===0)  ply.addImage(ply1);
  ply.scale=0.25;

  explosion=createSprite();
  explosion.addAnimation("explode",explosionAni);
  explosion.visible=false;


}

function draw() {
  background(0);
  image(bg,0,-displayHeight*3+300,displayWidth,displayHeight*4);
  camera.position.x=displayWidth/2;
  camera.position.y=ply.y;

  drawSprites();

  disLeft=1702+ply.y;

  if(gameState!=-1) lifes();
  if(score>=5000)   plyState=1; 
  if(plyState===1)  ply.addImage(ply2);

  fill(255);

  console.log(life);

  //intro
  if(gameState===-1){
    ply.visible=false;
    tint(112,112,112);
    image(bg,0,-displayHeight,displayWidth,displayHeight*2);
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(40);
    textStyle(BOLD);
    text("ASTEROID ALERT!!!",displayWidth/2,displayHeight/2.2);
    textSize(20);
    text("Hi! You are a astronaut who is about to cross the astroid belt.",displayWidth/2,displayHeight/2+50);
    text("Use arrow keys to control the spaceship.",displayWidth/2,displayHeight/2+80);
    text("Cross the asteroid belt without crashing to earn 1000 points.",displayWidth/2,displayHeight/2+110);
    text("Collect coins as much as you can to boost your points.",displayWidth/2,displayHeight/2+140);
    text("Earn 5000 points to upgrade your spaceship.",displayWidth/2,displayHeight/2+170);
    text("Wear your seat belts and get ready for your space flight.",displayWidth/2,displayHeight/2+200);
    textSize(25);
    text("Good Luck!!",displayWidth/2,displayHeight/2+240);
    text("Press SPACE",displayWidth/2,displayHeight/2+270);
    imageMode(CENTER);
    noTint();
    image(ply1,displayWidth/2-500,displayHeight/2,100,300);
    image(ply2,displayWidth/2+500,displayHeight/2,100,300);
    text("Max. Speed - 50 mph",displayWidth/2-500,displayHeight/2+170);
    text("Max. Speed - 75 mph",displayWidth/2+500,displayHeight/2+170);
    if(keyCode===32){
      gameState=0;
    }
  }
  //play
  else if(gameState===0){
    ply.visible=true;

    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(30);
    text("Score: "+score,displayWidth/2-200,ply.y-250);
    text("Number of coins: "+noCoins,displayWidth/2+200,ply.y-250);
    text("Distance left: "+disLeft,displayWidth/2,ply.y+275)
    spawnAst();
    spawnCoin();

    movePlayer();
    if(ply.isTouching(coins)){
      score+=500;
      noCoins++;
      coins.destroyEach();
    }
    if(ply.isTouching(asts)){
      gameState=1;
      explode.play();
      life-=1;
    }
    if(ply.y<-1700){
      gameState=2;
      score+=500;
      win.play();
    }
  }
  //hit
  else if(gameState===1){
    asts.setVelocityXEach(0);
    explosion.x=ply.x;
    explosion.y=ply.y;
    explosion.visible=true;
    ply.visible=false;
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(30);
    text("Ohh...! You have crashed. Yet you have "+life+" more chances.",displayWidth/2,ply.y-150);
    textSize(25);
    text("Press R",displayWidth/2,ply.y+50);
    if(keyCode===114 && life>0){//R
      reset();
    }
    if(life===0){
      gameState=3;
    }
  }
  //win
  else if(gameState===2){
    asts.destroyEach();
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(30);
    if(plyState===1){
      text("Spaceship upgraded!",displayWidth/2,ply.y-100)
    }
    text("You have successfully crossed the asteroid belt.",displayWidth/2,ply.y-150);
    textSize(25);
    text("Your Score: "+score,displayWidth/2,ply.y+100);
    text("Number of Coins collected: "+noCoins,displayWidth/2,ply.y+125);
    text("Press W to continue",displayWidth/2,ply.y+150);
    if(keyCode===119){//W
      continueGame();
    }
  }
  //over
  else if(gameState===3){
    asts.destroyEach();
    stroke(0);
    strokeWeight(2);
    textAlign(CENTER);
    textSize(30);
    text("GAME OVER",displayWidth/2,ply.y-150);
    textSize(25);
    text("Your Score: "+score,displayWidth/2,ply.y+100);
    text("Number of Coins collected: "+noCoins,displayWidth/2,ply.y+125);
    text("Press A to continue",displayWidth/2,ply.y+150);
    if(keyCode===65){//A
      playAgain();
    }
  }

}

function spawnAst() {
  if (frameCount%15===0) {
    ast1=createSprite(random(40,displayWidth-50),random(ply.y+200,-displayHeight*3));
    rand=Math.round(random(1,4));
    switch (rand) {
      case 1:
        ast1.addImage(ast1Img);
        break;
      case 2:
        ast1.addImage(ast2Img);
        break;
      case 3:
        ast1.addImage(ast3Img);
        break;
      case 4:
        ast1.addImage(ast4Img);
        break;
      default:
        break;
    }
    ast1.scale=0.2;

    ast1.velocityX=random(random(-15,-8),random(8,15));
    asts.add(ast1);
  }
}

function spawnCoin(){
  if(frameCount%75===0){  
    coin=createSprite(random(40,displayWidth-50),random(ply.y+200,-displayHeight*3-500));
    coin.addImage(coinImg);
    coin.scale=0.1;
    coins.add(coin);
  }
}

function movePlayer() {
  if (keyIsDown(UP_ARROW)) {
    ply.y-=5;
    if (plyState===1) {
      ply.y-=7;
    }
  }
  if (keyIsDown(DOWN_ARROW)&& ply.y<730) {
    ply.y+=5;
    if (plyState===1) {
      ply.y+=7;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ply.x+=5;
    if (plyState===1) {
      ply.x+=7;
    }
  }
  if (keyIsDown(LEFT_ARROW)) {
    ply.x-=5;
    if (plyState===1) {
      ply.x-=7;
    }
  }
}

function continueGame() {
  reset();
  resetPlayer();
  life=3;
}

function playAgain() {
  score=0;
  noCoins=0;
  life=3;
  reset();
  resetPlayer();
}

function reset(){
  gameState=0;
  explosion.visible=false;
  asts.destroyEach();
  ply.visible=true;
}

function resetPlayer() {
  ply.x=displayWidth/2;
  ply.y=displayHeight-300;
}

function lifes() {
  imageMode(CENTER);
  if(life!=0){
    if(life>=1){
      image(lifeImg,displayWidth/2,ply.y-255,20,20);
      if(life>=2){
        image(lifeImg,displayWidth/2-25,ply.y-255,20,20);
        if(life===3){
          image(lifeImg,displayWidth/2+25,ply.y-255,20,20);
        }
      }
    }
  }
}