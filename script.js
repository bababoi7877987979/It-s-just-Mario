const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let soundStep = new Audio('./sound/step.mp3');


let picBackground = new Image();
    picBackground.src = "./pic/background.jpg";

let picPlayerLeft = new Image();
    picPlayerLeft.src = "./pic/playerLeft.png";
let picPlayerRight = new Image();
    picPlayerRight.src = "./pic/playerRight.png";

let arrPicPlayer = [];
    arrPicPlayer['left']=picPlayerLeft;
    arrPicPlayer['right']=picPlayerRight;

let picEnemyLeft = new Image();
    picEnemyLeft.src = "./pic/enemyLeft.png";
let picEnemyRight = new Image();
    picEnemyRight.src = "./pic/enemyRight.png";

let picLife = new Image();
    picLife.src = "./pic/picLife.png";

let picCoin = new Image();
    picCoin.src = "./pic/picCoin.png";

let arrPicEnemy = [];
    arrPicEnemy['left']=picEnemyLeft;
    arrPicEnemy['right']=picEnemyRight;

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function generateRandomPosition(pic, xMin, xMax, yMin, yMax){
    let x = Math.random()*((xMax-pic.width)-xMin)+xMin,
    y=Math.random()*((yMax-pic.height)-yMin)+yMin;
    return [x,y];
}
let positionCoin=[0,0];
function newPositionCoin(){
    positionCoin=generateRandomPosition(picCoin,0,innerWidth,innerHeight*0.7, innerHeight*0.88);
}

function resizeImg(img, percent){
    let prop;
    if(img.width>img.height){
        prop = img.width/img.height;
        img.height = window.innerHeight*percent/100;
        img.width = img.height*prop;
    }else{
        prop = img.height/img.width;
        img.width = window.innerHeight*percent/100;
        img.height = img.width*prop;
    }
}
 let startGame = false;
 let xPlayer = 50, yPlayer = 665,
     speedPlayer = 5, speedEnemy=50,
     navPlayer = 'right', navEnemy = 'left',
     xEnemy = 750, yEnemy = 680,  boardPicPlayer,  boardPicEnemy,
boardPicCoin,     countLife = 3; countCoin=0;

     function boardPic(pic, x, y){
        let picRight, picBottom;
        picRight = x + pic.width;
        picBottom = y + pic.height;
        return [picRight, picBottom]
    }

function checkCollision(x1,x2,y1,y2,r1,r2,b1,b2){
    if(r1>x2 && r2>x1 &&y1<b2 && y2<b1){
        return true;
    }
    else{
        return false;
    }
}


function draw(){
    function printText(text,x,y,size,color){
        ctx.font = size+"px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text,x,y);
    }
    let picPlayer = arrPicPlayer[navPlayer];
    let picEnemy = arrPicEnemy[navEnemy];
    resizeImg(picPlayer,8);
    resizeImg(picEnemy,5);
    resizeImg(picLife,5);
    resizeImg(picCoin,3);
     boardPicPlayer = boardPic(picPlayer,xPlayer,yPlayer);
     boardPicEnemy = boardPic(picEnemy,xEnemy,yEnemy);
     boardPicCoin = boardPic(picCoin,positionCoin[0],positionCoin[1]);
    function startPosition(){
        xPlayer = window.innerWidth*0.05;
        yPlayer = window.innerHeight*0.88-picPlayer.height;
        
        xEnemy = window.innerWidth*0.85;
        yEnemy = window.innerHeight*0.88-picEnemy.height;
    }

    function moveEnemy(){
        function collisionEnemy(){
            if(checkCollision(xPlayer,xEnemy,yPlayer,yEnemy,boardPicPlayer[0],boardPicEnemy[0],boardPicPlayer[1],boardPicEnemy[1])){
                countLife--;
                if(countLife<=0){
                    let newGame = confirm('GameOver:(\nХотите начать заново?');
                    if(newGame){
                        countLife=3;
                    }else{
                        clearTimeout(timerMoveEnemy);
                        startPosition();
                        return;
                    }
                }
                startPosition();
            }
        }
        collisionEnemy();
        let timerMoveEnemy = setTimeout(()=>{
            if(xEnemy>(xPlayer+picPlayer.width)){
                xEnemy--;
                navEnemy='left';
            }else if((xEnemy+picEnemy.width)<xPlayer){
                xEnemy++;
                navEnemy='right';
            }
            draw();
            moveEnemy();
        },speedEnemy);
    }
    
    if(startGame){
        startPosition();
        newPositionCoin();
        moveEnemy();
        startGame=false;
    }

    ctx.drawImage(picBackground, 0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(picPlayer, xPlayer, yPlayer, picPlayer.width,picPlayer.height);
    ctx.drawImage(picEnemy, xEnemy, yEnemy, picEnemy.width,picEnemy.height);
    ctx.drawImage(picCoin, positionCoin[0], positionCoin[1], picCoin.width,picCoin.height);

    for(let i=0; i<countLife;i++){
        let yLife = innerHeight*0.05;
        let xLife = innerWidth*0.05+picLife.width*i;
        ctx.drawImage(picLife, xLife, yLife, picLife.width,picLife.height);
    }
  function collisionCoin(){
        if(checkCollision(xPlayer, positionCoin[0],yPlayer,positionCoin[1],boardPicPlayer[0],boardPicCoin[0],boardPicPlayer[1],boardPicCoin[1])){
            countCoin++;
            newPositionCoin();
        }
  }
  collisionCoin();
    printText("Count = "+countCoin,innerWidth*0.05,innerHeight*0.05+picLife.height,"Green")
}


picEnemyRight.onload =picEnemyLeft.onload = picPlayerLeft.onload= picPlayerRight.onload = picBackground.onload = draw;

document.addEventListener('keydown',(event)=>{
    let KeyPressed = event.code;
    switch(KeyPressed){
        case 'ArrowLeft':
            xPlayer-=speedPlayer;
            navPlayer = 'left';
            soundStep.play();            
        break;
        case 'ArrowRight':
            xPlayer+=speedPlayer;
            navPlayer = 'right';
            soundStep.play();
        break;
        case 'Enter':
            startGame=true;
        break;
    }
    draw();
});

document.addEventListener('keyup',(event)=>{
    let KeyPressed = event.code;
    switch(KeyPressed){
        case 'ArrowLeft':
            soundStep.pause();            
        break;
        case 'ArrowRight':
            soundStep.pause();
        break;
    }
});