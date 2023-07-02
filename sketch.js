let outerShapeMargin = 45;

let shapesColorMix = 0;
let shapesColorEasing = 0.0007; // 1.0 to 0
let backgroundColorMix = 0;
let backgroundColorEasing = 0.000008;

// Ring stuff
let numRings;
let ringWidth;
let largestRadius;
let overlap;
let centerX;
let centerY;
let showText = true;
let promptText = "[v13] Click to start sounds ... ";
// Colors
let ringStartColor = [];
let ringEndColor = [];
let centreStartColor, centreEndColor;
let backgroundStartColor, backgroundEndColor;
// Sounds/Samples
let pianoSounds = [];
let sineSounds = [];
// let droneSounds = [];
let nextPlayTime;
let soundFolder = "assets/Thursday-Afternoon-Samples/Samples/wav";

let soundScheduler = [
  // ==========================================================================
  // piano sounds
  // ==========================================================================
  {
    file: "piano/b2-36.wav",
    interval: 36,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/b3-16.wav",
    interval: 16,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/c4-23.wav",
    interval: 23,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/d3-15.wav",
    interval: 15,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/d4-60.wav",
    interval: 60,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/f3-21.wav",
    interval: 21,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "piano/g3-15.wav",
    interval: 15,
    nextPlay: undefined,
    audio: undefined,
  },
  // ==========================================================================
  // synth sounds
  // ==========================================================================
  {
    file: "synth/b2-16.wav",
    interval: 16,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/b3-18.wav",
    interval: 18,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/c4-19.wav",
    interval: 19,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/d3-31.wav",
    interval: 31,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/d4-20.wav",
    interval: 20,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/f3-21.wav",
    interval: 21,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/g2-36.wav",
    interval: 36,
    nextPlay: undefined,
    audio: undefined,
  },
  {
    file: "synth/g3-15.wav",
    interval: 15,
    nextPlay: undefined,
    audio: undefined,
  },
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  initRings();
  initColors();
}

function myLoadSoundXX(path) {
  return loadSound(path);
}

function myLoadSound(path) {
  let audio = new Audio(path);
  audio.mozPreservesPitch = false;
  audio.preservesPitch = false;
  audio.volume = 0.2; // Reduced volume to avoid clipping
  audio.playbackRate = 1.0; // this.pitch;
  // sound.loop = true;
  // s.play();
  audio.autoplay = true;
  return audio;
}

function preload() {
  // soundScheduler.forEach(
  //   (item) => (item.audio = myLoadSound(`${soundFolder}/${item.file}`))
  // );
}

function createAudioObjects() {
  soundScheduler.forEach(
    (item) => (item.audio = myLoadSound(`${soundFolder}/${item.file}`))
  );
}
function mousePressed() {
  if (showText) {
    createAudioObjects();
    launchSoundLoops();
    if (!fullscreen()) {
      fullscreen(true);
    }
    showText = false;
  }
}

function touchStarted() {
  if (showText) {
    showText = false;
    createAudioObjects();
    launchSoundLoops();
    if (!fullscreen()) {
      fullscreen(true);
    }
  }
  document.documentElement.requestFullscreen();
}

function initRings() {
  // Ring stuff
  numRings = 3; // Number of concentric rings
  largestRadius = min(height, width) / 2 - outerShapeMargin; // Radius of the largest ring
  overlap = 5; // Amount of overlap between rings
  centerX = width / 2; // X-coordinate of the center
  centerY = height / 2; // Y-coordinate of the center
  ringWidth = largestRadius / numRings; // Width of each ring
}

function initColors() {
  // Color stuff
  for (let i = 0; i < numRings - 1; i++) {
    ringStartColor.push(newRandomRingColor());
    ringEndColor.push(newRandomRingColor());
  }
  centreStartColor = newRandomCentreColor();
  centreEndColor = newRandomCentreColor();

  backgroundStartColor = newRandomBackgroundColor();
  backgroundEndColor = newRandomBackgroundColor();
}

function newRandomRingColor() {
  let hue = random(0, 360);
  let saturation = random(80, 100);
  let brightness = random(90, 100);
  let alpha = random(0, 255);
  let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values
  return ringColor;
}

function newRandomCentreColor() {
  let hue = random(0, 360);
  let saturation = random(0, 100);
  let brightness = 100; // random(90, 100);
  let alpha = random(200, 255);
  return color(hue, saturation, brightness, alpha); // Create a color object with the generated values
}

function newRandomBackgroundColor() {
  let hue = random(0, 360);
  let saturation = random(100, 180);
  let brightness = random(220, 255);
  let alpha = random(48, 64);
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

  fill(ringColor); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);

  // draw the "inner ring" filled with the canvas background color
  fill(ringBackgroundColor); // Set fill color to the background color
  ellipse(centerX, centerY, innerDiameter, innerDiameter);

  endShape();

  // draw the light "glow" around the outside of the ring
  beginShape();
  noFill();

  stroke(225, 225, 255, 3);
  let outlines = 12;
  for (let outline = 0; outline < outlines; outline += 2) {
    strokeWeight(outline);

    ellipse(centerX, centerY, outerDiameter + outline, outerDiameter + outline);
  }
  endShape();
}

function drawCircle(outerRadius, circleColor) {
  let outerDiameter = outerRadius * 2; // Calculate diameter

  beginShape();
  noStroke();
  // stroke(255, 255, 255, 45);
  // strokeWeight(overlap);

  fill(circleColor); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);

  endShape();

  beginShape();
  noFill();

  stroke(225, 225, 200, 3);
  let outlines = 12;
  for (let outline = 0; outline < outlines; outline += 2) {
    strokeWeight(outline);

    ellipse(centerX, centerY, outerDiameter + outline, outerDiameter + outline);
  }
  endShape();
}

function rotateColors() {
  for (let i = 0; i < numRings; i++) {
    ringStartColor[i] = ringEndColor[i];
    ringEndColor[i] = newRandomRingColor();
  }

  centreStartColor = centreEndColor;
  centreEndColor = newRandomCentreColor();
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
    // playSound();
    setNextPlayTime(); // Set the next play time
  }

  if (showText) {
    beginShape();
    textAlign(CENTER, CENTER);
    fill(0); // Set text color to black
    textSize(24);
    text(promptText, width / 2, height / 2);
    endShape();
  }
}

function launchSoundLoops() {
  soundScheduler.forEach((item) => {
    scheduleSound(item);
  });
}

function scheduleSound(item) {
  let soundPlayer = new SoundPlayer(item.audio, item.interval);
  soundPlayer.startPlaying();
}

/* full screening will change the size of the canvas */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initRings();
}

/* prevents the mobile browser from processing some default
 * touch events, like swiping left for "back" or scrolling the page.
 */
document.ontouchmove = function (event) {
  event.preventDefault();
};
