let hue1, hue2;
let saturation1, saturation2;
let brightness1, brightness2;
let alpha1, alpha2;
let ringColor1, ringColor2;
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

function setup() {
  createCanvas(560, 560); // Adjust the canvas size as per your needs
  initRings();
  initColors();
}

function initRings() {
  // Ring stuff
  numRings = 3; // Number of concentric rings
  ringWidth = 50; // Width of each ring
  largestRadius = 250; // Radius of the largest ring
  overlap = 10; // Amount of overlap between rings
  centerX = width / 2; // X-coordinate of the center
  centerY = height / 2; // Y-coordinate of the center
}

function initColors() {
  // Color stuff

  ringColor1 = newRandomColor();
  ringColor2 = newRandomColor();

  // ringColor1 = color("#8F28A1"); // warm purple color
  //ringColor2 = color("#3BEDB7"); // mint green color
}

function newRandomColor() {
  let hue = random(360); // Generate a random hue value
  let saturation = random(50, 255); // Generate a random saturation value within a pastel range
  let brightness = random(70, 90); // Generate a random brightness value within a pastel range
  let alpha = 123;
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

  return ringColor;
}

function drawRings() {
  let backgroundColor = 236;
  background(backgroundColor); // Set the background color

  // Draw the concentric rings
  for (let i = 0; i < numRings; i++) {
    let outerRadius = largestRadius - i * ringWidth; // Calculate radius for each ring
    let outerDiameter = outerRadius * 2; // Calculate diameter

    let innerRadius = outerRadius - ringWidth; // Calculate radius for each ring
    let innerDiameter = innerRadius * 2 - overlap; // Calculate diameter

    noStroke(); // Disable stroke for rings

    // let mixTarget = map(mouseX, 0, width, 0.0, 1.0);
    // mix = mix + (mixTarget - mix) * easing;

    dynamicColor = lerpColor(ringColor1, ringColor2, mix);
    // console.log(dynamicColor.levels);
    console.log(mix);
    fill(dynamicColor); // Set fill color to the generated pastel color

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
}

function draw() {
  // frameRate(2);

  mix += 0.005;

  if (mix > 1.0) {
    rotateColors();
    mix = 0;
  }

  drawRings();

  // noLoop();
}
