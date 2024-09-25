let angle = 0;
let rotationSpeed = 0.01;
let maxSpeed = 0.05;

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB);
}

function draw() {
  background(0);
  
  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 100);
  
  // Rotate based on current angle
  rotateY(angle);
  rotateX(angle * 0.5);
  
  // Draw first helix
  drawHelix(0, 100);
  
  // Draw second helix, offset by half a rotation
  drawHelix(PI, 100);
  
  // Update angle
  angle += rotationSpeed;
  
  // Handle mouse interaction
  if (mouseIsPressed) {
    let centerX = width / 2;
    let centerY = height / 2;
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    let distanceFromCenter = dist(mouseX, mouseY, centerX, centerY) / (width / 2);
    
    if (distanceFromCenter > 1) {
      // Mouse is dragged from periphery to center
      rotationSpeed = max(0.01, rotationSpeed - 0.001);
    } else {
      // Mouse is dragged from center to periphery
      let targetSpeed = map(distanceFromCenter, 0, 1, 0.01, maxSpeed);
      rotationSpeed = min(maxSpeed, targetSpeed);
    }
  }
}

function drawHelix(startAngle, radius) {
  let points = 100;
  let angleStep = TWO_PI / points;
  
  noFill();
  strokeWeight(3);
  
  beginShape();
  for (let i = 0; i < points; i++) {
    let hue = map(i, 0, points, 0, 360);
    stroke(hue, 100, 100);
    
    let x = radius * cos(i * angleStep + startAngle);
    let y = radius * sin(i * angleStep + startAngle);
    let z = map(i, 0, points, -100, 100);
    
    vertex(x, y, z);
  }
  endShape();
}
