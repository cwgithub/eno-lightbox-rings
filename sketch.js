let outerShapeMargin = 45;

let shapesColorMix = 0;
let shapesColorEasing = 0.0005; // 1.0 to 0
let backgroundColorMix = 0;
let backgroundColorEasing = 0.000005;

// Ring stuff
let numRings;
let ringWidth;
let largestRadius;
let overlap;
let centerX;
let centerY;

let showText = true;

// Colors
let ringStartColor = [];
let ringEndColor = [];
let centreStartColor, centreEndColor;
let backgroundStartColor, backgroundEndColor;

// Sounds/Samples
let pianoSounds = [];
let sineSounds = [];
let droneSounds = [];
let soundFile;
let nextPlayTime;

function setup() {
  // Set the initial next play time
  setNextPlayTime();
  createCanvas(windowWidth, windowHeight);
  initRings();
  initColors();
}

function preload() {
  for (let i = 1; i < 9; i++) {
    if (i > 1) {
      pianoSounds.push(
        loadSound(`assets/Thursday-Afternoon-Samples/Samples/piano${i}.wav`)
      );

      if (i < 4) {
        droneSounds.push(
          loadSound(
            `assets/Thursday-Afternoon-Samples/Samples/thursday-drone-${i}.wav`
          )
        );
      }

      sineSounds.push(
        loadSound(`assets/Thursday-Afternoon-Samples/Samples/sine${i}.wav`)
      );
    }
  }

  // Load the sound file from the assets folder
  soundFile = loadSound(
    "assets/Thursday-Afternoon-Samples/Samples/piano2.wav "
  );
}

function mousePressed() {
  showText = false;
  playSound();

  if (!fullscreen()) {
    fullscreen(true);
  }
}

function touchStarted() {
  showText = false;
  playSound();
  if (!fullscreen()) {
    fullscreen(true);
  }
}

function initRings() {
  // Ring stuff
  numRings = 3; // Number of concentric rings
  largestRadius = min(height, width) / 2 - outerShapeMargin; // Radius of the largest ring
  overlap = 0; // Amount of overlap between rings
  centerX = width / 2; // X-coordinate of the center
  centerY = height / 2; // Y-coordinate of the center
  ringWidth = largestRadius / numRings; // Width of each ring
}

function initColors() {
  // Color stuff
  for (let i = 0; i < numRings - 1; i++) {
    ringStartColor.push(newRandomColor());
    ringEndColor.push(newRandomColor());
  }
  centreStartColor = newRandomColor();
  centreEndColor = newRandomColor();

  backgroundStartColor = newRandomBackgroundColor();
  backgroundEndColor = newRandomBackgroundColor();
}

function newRandomColor() {
  let hue = random(360);
  let saturation = random(80, 100);
  let brightness = random(200, 255);
  let alpha = random(0, 255);
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

  return ringColor;
}

function newRandomBackgroundColor() {
  let hue = random(160, 190);
  let saturation = random(100, 180);
  let brightness = random(220, 255);
  let alpha = random(0, 255);
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

  return ringColor;
}

function drawRings() {
  let backgroundColor = lerpColor(
    backgroundStartColor,
    backgroundEndColor,
    backgroundColorMix
  );
  background(backgroundColor); // Set the background color

  // Draw the concentric rings
  for (let i = 0; i < numRings; i++) {
    let outerRadius = largestRadius - i * ringWidth; // Calculate radius for each ring

    if (i < numRings - 1) {
      let ringColor = lerpColor(
        ringStartColor[i],
        ringEndColor[i],
        shapesColorMix
      );
      drawRing(outerRadius, ringColor, backgroundColor);
    } else {
      let circleColor = lerpColor(
        centreStartColor,
        centreEndColor,
        shapesColorMix
      );
      drawCircle(outerRadius, circleColor);
    }
  }
}

function drawRing(outerRadius, ringColor, ringBackgroundColor) {
  let outerDiameter = outerRadius * 2; // Calculate diameter
  let innerRadius = outerRadius - ringWidth; // Calculate radius for each ring
  let innerDiameter = innerRadius * 2; // Calculate diameter

  beginShape();
  noStroke();
  stroke(255, 255, 255, 45);
  strokeWeight(overlap);

  fill(ringColor); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);

  fill(ringBackgroundColor); // Set fill color to the background color
  ellipse(centerX, centerY, innerDiameter, innerDiameter);

  endShape();
}

function drawCircle(outerRadius, circleColor) {
  let outerDiameter = outerRadius * 2; // Calculate diameter

  beginShape();
  noStroke();
  stroke(255, 255, 255, 45);
  strokeWeight(overlap);

  fill(circleColor); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);

  endShape();
}

function rotateColors() {
  for (let i = 0; i < numRings; i++) {
    ringStartColor[i] = ringEndColor[i];
    ringEndColor[i] = newRandomColor();
  }

  centreStartColor = centreEndColor;
  centreEndColor = newRandomColor();
}

function rotateBackgroundColor() {
  backgroundStartColor = backgroundEndColor;
  backgroundEndColor = newRandomBackgroundColor();
}

function draw() {
  // mix += 0.0005;
  // mix += 0.01; // fast changes for debugging

  shapesColorMix += shapesColorEasing; // acceptable speed
  if (shapesColorMix > 1.0) {
    rotateColors();
    shapesColorMix = 0;
  }

  backgroundColorMix += backgroundColorEasing;
  if (backgroundColorMix > 1.0) {
    rotateBackgroundColor();
    backgroundColorMix = 0;
  }

  drawRings();

  // Check if it's time to play the sound
  if (millis() >= nextPlayTime) {
    playSound();
    setNextPlayTime(); // Set the next play time
  }

  if (showText) {
    beginShape();
    textAlign(CENTER, CENTER);
    fill(0); // Set text color to black
    textSize(24);
    text("Click to start sounds ...", width / 2, height / 2);
    endShape();
  }
}

function setNextPlayTime() {
  // Set a random interval between 1 and 5 seconds
  const interval = random(1000, 5000);
  nextPlayTime = millis() + interval;
}

function playSound() {
  if (floor(random(0, 3)) === 0) {
    let noteCount = floor(random(3));

    for (let notes = 0; notes < noteCount; notes++) {
      let pIdx = floor(random(2, 8));
      if (pianoSounds[pIdx] && pianoSounds[pIdx].isLoaded()) {
        // Play the sound file
        pianoSounds[pIdx].play();
      }
    }
  } else {
    let sIdx = floor(random(1, 8));
    if (sineSounds[sIdx] && sineSounds[sIdx].isLoaded()) {
      // Play the sound file
      sineSounds[sIdx].play();
    }
  }

  // let dIdx = floor(random(1, 3));
  // if (droneSounds[dIdx].isLoaded()) {
  //   // Play the sound file
  //   droneSounds[dIdx].play();
  // }
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function (event) {
  event.preventDefault();
};
