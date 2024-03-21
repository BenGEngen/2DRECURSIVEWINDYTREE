let particles = [];  ///  particle array
let numberOfParticles = 600;  //  number of particles to be in particle system, displayed on screen
let gravity = 0.5;  //  for gravity of particles


let backgroundImage;     //  backgroundImage
let trunkLen =    125;   //  length of the trunk
let windInc =     0.01;  //  wind increment changes speed

let windSpeed =   0;     //  windspeed
let noisePos =    0;     //  position within Perlin noise


let branchAngle = 25;    //  angle between two branches
let minLen =      7;    //  minimum size of branches


function setup() {

  createCanvas(windowWidth, windowHeight);

  backgroundImage = loadImage('assets/fieldPainting.jpg');  //  loads background image

  for (let i = 0; i < numberOfParticles; i++ ){  //  loads particle array
    particles[i] = new Particle();
  }
}


function draw() {
   
  image(backgroundImage, 0, 0, width, height);

  fill(74, 101, 131, 150); //  blue with opacity

  for (let i = 0; i < particles.length; i++){
    particles[i].move();
    particles[i].display();
       
  }
  gravity = map(mouseX + 200, 0, height, 0, 3); //  using mouseX controls gravity, 0-width of screen
  console.log(gravity);
    
  //  recursive tree

  push();
  translate(width/2, height);
  stroke(51, 24, 0);
  strokeWeight(10);
  line(0,0, 0,-trunkLen);
  branch(trunkLen);
  
  
  //  used perlin noise for windspeed. provides smoother motion. equates to 0-30º for windspeed

  windSpeed = noise(noisePos) * 30;
  noisePos += windInc;
  pop();
}


//  recursive function to draw tree

function branch (len) {
 
  let prevLen = len;  //  store previous length and reduce branch length
  len *= 0.5 * sqrt(2);    
  

  if (len > minLen) {  //  this loop goes until the branches are too small
    
    let stiffness = map(len, minLen, trunkLen, 1.0, 0.2);  //  stiffness of branches
  
    
    let twist = windSpeed * stiffness;  //  adds twist based on the wind speed and stiffness
    
    //  draw left branches while accounting for wind

    push(); 
    stroke(51, 24, 0); 
    translate(0, -prevLen);                 
    rotate(radians(-branchAngle + twist));  
    line(0, 0, 0, -len);                    
    branch(len);                            
    pop();

    //  draw right branches, does not account for wind

    push();
    stroke(51, 24, 0);
    translate(0, -prevLen);
    rotate(radians(branchAngle));
    line(0, 0, 0, -len);
    branch(len);
    pop();
  }else{

    var red1 = 61; //  base colors for leaves
    var green1 = 134;
    var blue1 = 11;

    noStroke();
    fill(random(20, red1), random(60, green1), random(0, blue1), 150); //  fills in ellipse with random green color
    ellipse(0, 0, 25 + mouseY - 5); //  draws an ellipse at the end of the branch
    fill(red1, random(60, green1), blue1, 150);
    ellipse(15, 15, 25 + mouseY - 5); //  draws an ellipse further down 
    fill(random(20, red1), random(60, green1), random(0, blue1), 150);
    ellipse(20, 20, 25 + mouseY -5); //  draws an ellipse even further down
    }
  }


//  class to create particle system

class Particle {

    constructor() {  //  establishes size of particle with speed taken into account.
    this.height = 4;
    this.width = 4;
    this.x = random(width);
    this.y = random(height);
    this.xSpeed  = random(0, 3);
  }

  display(){
    noStroke();  //  draws rectangular particle with no border
    rect(this.x, this.y, this.width, this.height, 20);
  }

  move(){
    this.x = this.x + this.xSpeed;  //  moves particle based upon randomly generated x and y coordinates.
    this.y = this.y + gravity;
    if (this.x > width){
      this.x = 0;
    }
    if(this.y > height){
      this.y = 0;
    }
  }
}
