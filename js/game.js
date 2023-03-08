// Developer variables
let developerMode = true;

// Game state variables
let gameIsRunning = false;
let gameState = "start";

// Game environment variables
let gravity = 0.05;

// Ship variables
let ship = {
    latitude: 150,
    altitude: 55,
    acceleration: 0,
    velocity: 0
};

// Game difficulty variables
let crashVelocityThreshold = 2;

// Game input effect variables
let thrusterAcceleration = 0.12;

// Game animation variables
let shipTrailLines = [];

function setup(){
    frameRate(30);
    let canvas = createCanvas(300, 450);
    if(!developerMode) canvas.parent("gameWindow");
}

function drawShip(positionX, positionY){
    push();
    translate(positionX, positionY);    
    noFill();
    stroke(220);
    triangle(-25, 25, 0, -25, 25, 25);
    fill(20);
    triangle(-15, 25, 0, -45, 15, 25);
    pop();
}

function drawEnvironment(){
    background(20);
    push();
    noFill();
    stroke(220);
    rect(5, -1, width - 10, height + 10);
    rect(10, -1, width - 20, height + 10);    
    pop();
}

function applyGravity(){    
    ship.acceleration = gravity;
}

function accelerateShip(){
    ship.velocity += ship.acceleration;
    ship.altitude += ship.velocity;
}

function checkCollision(){
    if(ship.altitude > 373){        
        if(ship.velocity > crashVelocityThreshold){
            // Speed would be too high at contact [CRASH]
            gameState = "loss";
        }else{
            // Speed would be safe for contact [LAND]
            displayPrompt("You LANDED. Press SPACE", 55, 220);      
            gameState = "win";      
        }
        ship.altitude = 373;
        ship.velocity = 0;
        ship.acceleration = 0;
        gameIsRunning = false;        
    }
}

function activateThrusters(){
    ship.acceleration -= thrusterAcceleration;
}

function checkInput(){
    if(keyIsPressed){
        if(key === " " || touches.length > 0){
            switch(gameState){
                case "start":
                    gameState = "game";
                    gameIsRunning = true;
                    break;
                case "game":
                    activateThrusters();
                    break;
                case "win":
                    ship.latitude = 150;
                    ship.altitude = 125;                    
                    gameState = "game"; 
                    gameIsRunning = true;                   
                    break;
                case "loss":
                    ship.latitude = 150;
                    ship.altitude = 125;                    
                    gameState = "game"; 
                    gameIsRunning = true;                   
                    break;
                default:
                    break;
            }
        }
    }
}

function drawSpeedometer(){
    push();
    stroke(200);
    fill(200);
    textSize(14);
    text("Velocity:  " + Math.abs(Math.floor(ship.velocity)), 20, 35);
    pop();
}

function drawAltitudeMeter(){
    push();
    stroke(200);
    fill(200);
    textSize(14);
    text("Altitude:  " + (373 - Math.floor(ship.altitude)), 190, 35);
    pop();
}

function displayPrompt(message, positionX, positionY){
    push();
    stroke(200);
    fill(200);
    textSize(16);
    text(message, positionX, positionY);
    pop();
}

function drawShipTrail(){
    
    // Create trail lines
    if((frameCount % 10) == 0){
        shipTrailLines = [];
        for(let counter = 0; counter < 3; counter ++){
            shipTrailLines.push({
                trailPositionX: Math.ceil(Math.random() * 20),
                trailLength: Math.abs(Math.ceil(Math.random() * ship.velocity * 35) % 35),
                trailDissipationFrames: 10
            });
        }        
    }
    // Draw trail lines
    push();
    for(let trailLine of shipTrailLines){
        noFill();
        stroke(220, 220, 200, Math.floor(255 * (trailLine.trailDissipationFrames - (frameCount % trailLine.trailDissipationFrames)) / trailLine.trailDissipationFrames));
        line(
            trailLine.trailPositionX + ship.latitude - 10,
            ship.altitude + 35,
            trailLine.trailPositionX + ship.latitude - 10,
            trailLine.trailLength + ship.altitude + 35
        );
    }
    pop();
}

function drawPlanet(){
    push();
    stroke(220);
    fill(20);
    ellipse(150, 550, 300);
    pop();
}

function drawShipWrecks(){
    // Draw wreckage parts    
    for(let wreckCount = -1; wreckCount < 2; wreckCount++){
        push();
        translate(ship.latitude, 373);
        rotate(frameCount);
        noFill();
        stroke(220, 220, 220, Math.floor(255 * ((frameCount % 90)) / 90));
        triangle(-20, 0, 0, -30, 20, 0);
        pop();
    }
}

function draw(){
    switch(gameState){
        case "start":
            drawEnvironment();
            drawShip(ship.latitude, ship.altitude);
            drawPlanet();  
            displayPrompt("You're in SPACE. Press it.", 65, 220);
            checkInput();
            break;
        case "game":
            if(gameIsRunning){
                drawEnvironment();                
                applyGravity();
                checkInput();
                accelerateShip();
                drawSpeedometer();                
                drawAltitudeMeter();
                drawShip(ship.latitude, ship.altitude);
                drawShipTrail();   
                drawPlanet();   
                checkCollision();          
            }
            break;
        case "win":            
            checkInput();
            break;
        case "loss":
            drawEnvironment();
            drawPlanet();
            drawShipWrecks();
            displayPrompt("You CRASHED. Press SPACE", 45, 220);       
            checkInput();
            break;
        default:
            break;
    }
    drawSpeedometer();
    drawAltitudeMeter();
}