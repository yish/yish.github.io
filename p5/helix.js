let angle = 0;
let rotationSpeed = 0.01;
let maxSpeed = 0.05;

let lengthSlider, thicknessSlider;
let helix1ColorPicker, helix2ColorPicker, bgColorPicker;

function setup() {
  createCanvas(600, 600, WEBGL);
  
  lengthSlider = createSlider(50, 200, 100);
  lengthSlider.position(10, height + 10);
  
  thicknessSlider = createSlider(1, 10, 3);
  thicknessSlider.position(10, height + 40);
  
  helix1ColorPicker = createColorPicker('#ff0000');
  helix1ColorPicker.position(10, height + 70);
  
  helix2ColorPicker = createColorPicker('#0000ff');
  helix2ColorPicker.position(70, height + 70);
  
  bgColorPicker = createColorPicker('#f0f0f0');
  bgColorPicker.position(130, height + 70);
}

function draw() {
  background(bgColorPicker.color());
  
  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 0, 0, 100);
  
  // Rotate based on current angle
  rotateY(angle);
  rotateX(angle * 0.5);
  
  // Draw first helix
  drawHelix(0, lengthSlider.value(), helix1ColorPicker.color());
  
  // Draw second helix, offset by half a rotation
  drawHelix(PI, lengthSlider.value(), helix2ColorPicker.color());
  
  // Update angle
  angle += rotationSpeed;
  
  // Handle mouse interaction for rotation speed
  handleMouseInteraction();
}

function drawHelix(startAngle, radius, color) {
  let points = 100;
  let angleStep = TWO_PI / points;
  
  noFill();
  strokeWeight(thicknessSlider.value());
  
  beginShape();
  for (let i = 0; i < points; i++) {
    stroke(color);
    
    let x = radius * cos(i * angleStep + startAngle);
    let y = radius * sin(i * angleStep + startAngle);
    let z = map(i, 0, points, -100, 100);
    
    vertex(x, y, z);
  }
  endShape();
}

function handleMouseInteraction() {
  if (mouseIsPressed && mouseY < height) {  // Only handle interaction within the canvas
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
