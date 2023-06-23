let hue1, hue2;
let ringYOffset = 45;
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

let ringColor1 = [];
let ringColor2 = [];

let centreColor1, centreColor2;
let backgroundColor1, backgroundColor2;

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
  playSound();
  // fullscreen(!fullscreen());
}

function touchStarted() {
  alert("Touch detected");
  playSound();
}

function initRings() {
  // Ring stuff
  numRings = 3; // Number of concentric rings
  largestRadius = min(height, width) / 2 - ringYOffset; // Radius of the largest ring
  overlap = 0; // Amount of overlap between rings
  centerX = width / 2; // X-coordinate of the center
  centerY = height / 2; // Y-coordinate of the center
  ringWidth = largestRadius / numRings; // Width of each ring
}

function initColors() {
  // Color stuff

  for (let i = 0; i < numRings - 1; i++) {
    ringColor1.push(newRandomColor());
    ringColor2.push(newRandomColor());
  }

  centreColor1 = newRandomColor();
  centreColor2 = newRandomColor();

  backgroundColor1 = newRandomColor();
  backgroundColor2 = newRandomColor();
}

function newRandomColor() {
  let hue = random(360); // Generate a random hue value
  let saturation = random(100, 180); // Generate a random saturation value within a pastel range
  let brightness = random(200, 255); // Generate a random brightness value within a pastel range
  let alpha = random(0, 255);
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

  return ringColor;
}

function drawRings() {
  let backgroundColor = lerpColor(backgroundColor1, backgroundColor2, mix);
  background(backgroundColor); // Set the background color

  // Draw the concentric rings
  for (let i = 0; i < numRings; i++) {
    let outerRadius = largestRadius - i * ringWidth; // Calculate radius for each ring

    if (i < numRings - 1) {
      let ringColor = lerpColor(ringColor1[i], ringColor2[i], mix);
      drawRing(outerRadius, ringColor, backgroundColor);
    } else {
      let circleColor = lerpColor(centreColor1, centreColor2, mix);
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
    ringColor1[i] = ringColor2[i];
    ringColor2[i] = newRandomColor();
  }

  centreColor1 = centreColor2;
  centreColor2 = newRandomColor();

  backgroundColor1 = backgroundColor2;
  backgroundColor2 = newRandomColor();
}

function draw() {
  // mix += 0.0005;
  mix += 0.001; // acceptable speed
  // mix += 0.01; // fast changes for debugging

  if (mix > 1.0) {
    rotateColors();
    mix = 0;
  }

  drawRings();

  // Check if it's time to play the sound
  if (millis() >= nextPlayTime) {
    playSound();
    setNextPlayTime(); // Set the next play time
  }
}

function setNextPlayTime() {
  // Set a random interval between 1 and 5 seconds
  const interval = random(1000, 5000);
  nextPlayTime = millis() + interval;
}

// function playSound() {
//   // Check if the sound file is loaded successfully
//   if (soundFile.isLoaded()) {
//     // Play the sound file
//     soundFile.play();
//   }
// }

function playSound() {
  if (floor(random(0, 2)) === 0) {
    let pIdx = floor(random(2, 8));
    if (pianoSounds[pIdx] && pianoSounds[pIdx].isLoaded()) {
      // Play the sound file
      pianoSounds[pIdx].play();
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
