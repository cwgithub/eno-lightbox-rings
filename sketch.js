let hue1, hue2;
let saturation1, saturation2;
let brightness1, brightness2;
let alpha1, alpha2;

let easing = 0.05; // 1.0 to 0
let mix = 0;
let mixTarget = 0;
let dynamicColor;
// Ring stuff
let numRings;
let ringWidth;
let largestRadius;
let overlap;
let centerX;
let centerY;

let ringColor1, ringColor2;
let centreColor1, centreColor2;
let backgroundColor1, backgroundColor2;

function setup() {
  createCanvas(560, 560); // Adjust the canvas size as per your needs
  initRings();
  initColors();
}

function initRings() {
  // Ring stuff
  numRings = 2; // Number of concentric rings
  ringWidth = 60; // Width of each ring
  largestRadius = 230; // Radius of the largest ring
  overlap = 10; // Amount of overlap between rings
  centerX = width / 2; // X-coordinate of the center
  centerY = height / 2; // Y-coordinate of the center
}

function initColors() {
  // Color stuff
  ringColor1 = newRandomColor();
  ringColor2 = newRandomColor();

  centreColor1 = newRandomColor();
  centreColor2 = newRandomColor();

  backgroundColor1 = newRandomColor();
  backgroundColor2 = newRandomColor();
}

function newRandomColor() {
  let hue = random(360); // Generate a random hue value
  let saturation = random(100, 180); // Generate a random saturation value within a pastel range
  let brightness = random(200, 255); // Generate a random brightness value within a pastel range
  let alpha = random(200, 255);
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

  return ringColor;
}

function drawRings() {
  let backgroundColor = lerpColor(backgroundColor1, backgroundColor2, mix);

  background(backgroundColor); // Set the background color

  // Draw the concentric rings
  for (let i = 0; i < numRings; i++) {
    let outerRadius = largestRadius - i * ringWidth; // Calculate radius for each ring
    let outerDiameter = outerRadius * 2; // Calculate diameter

    let innerRadius = outerRadius - ringWidth; // Calculate radius for each ring
    let innerDiameter = innerRadius * 2 - overlap; // Calculate diameter

    noStroke(); // Disable stroke for rings

    stroke(255, 255, 255, 50);
    strokeWeight(3);

    let fillColor;

    if (i === 0) {
      fillColor = lerpColor(ringColor1, ringColor2, mix);
    } else {
      fillColor = lerpColor(centreColor1, centreColor2, mix);
    }

    console.log(mix);
    fill(fillColor); // Set fill color to the generated pastel color

    // Draw each ring
    ellipse(centerX, centerY, outerDiameter, outerDiameter);
    fill(backgroundColor); // Set fill color to the generated pastel color

    if (i !== numRings - 1) {
      // Draw each ring
      ellipse(centerX, centerY, innerDiameter, innerDiameter);
    }
  }
}

function rotateColors() {
  ringColor1 = ringColor2;
  ringColor2 = newRandomColor();

  centreColor1 = centreColor2;
  centreColor2 = newRandomColor();

  backgroundColor1 = backgroundColor2;
  backgroundColor2 = newRandomColor();
}

function draw() {
  // mix += 0.0005;
  mix += 0.001;

  if (mix > 1.0) {
    rotateColors();
    mix = 0;
  }

  drawRings();
}
