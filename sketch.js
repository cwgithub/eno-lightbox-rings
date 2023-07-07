let outerShapeMargin = 45;
let shapesColorMix = 0;
let shapesColorEasing = 0.0007; // 1.0 to 0
let backgroundColorMix = 0;
let backgroundColorEasing = 0.0008;

// Ring stuff
let numRings;
let ringWidth;
let largestRadius;
let overlap;
let centerX;
let centerY;
let showText = true;
let promptText = "[v14] Click to start sounds ... ";
// Colors
let ringStartColor = [];
let ringEndColor = [];
let centreStartColor, centreEndColor;
let backgroundStartColor, backgroundEndColor;
// Sounds/Samples
let soundFolder = "assets/Thursday-Afternoon-Samples/Samples/wav";

let colorFactory = new ColorFactory();

let soundScheduler = [
  // ==========================================================================
  // piano sounds
  // ==========================================================================
  {
    file: "piano/b2-36.wav",
    interval: 36,
    audio: undefined,
  },
  {
    file: "piano/b3-16.wav",
    interval: 16,
    audio: undefined,
  },
  {
    file: "piano/c4-23.wav",
    interval: 23,
    audio: undefined,
  },
  {
    file: "piano/d3-15.wav",
    interval: 15,
    audio: undefined,
  },
  {
    file: "piano/d4-60.wav",
    interval: 60,
    audio: undefined,
  },
  {
    file: "piano/f3-21.wav",
    interval: 21,
    audio: undefined,
  },
  {
    file: "piano/g3-15.wav",
    interval: 15,
    audio: undefined,
  },
  // ==========================================================================
  // synth sounds
  // ==========================================================================
  {
    file: "synth/b2-16.wav",
    interval: 16,
    audio: undefined,
  },
  {
    file: "synth/b3-18.wav",
    interval: 18,
    audio: undefined,
  },
  {
    file: "synth/c4-19.wav",
    interval: 19,
    audio: undefined,
  },
  {
    file: "synth/d3-31.wav",
    interval: 31,
    audio: undefined,
  },
  {
    file: "synth/d4-20.wav",
    interval: 20,
    audio: undefined,
  },
  {
    file: "synth/f3-21.wav",
    interval: 21,
    audio: undefined,
  },
  {
    file: "synth/g2-36.wav",
    interval: 36,
    audio: undefined,
  },
  {
    file: "synth/g3-15.wav",
    interval: 15,
    audio: undefined,
  },
];

function setup() {
  colorMode(HSB);
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
    ringStartColor.push(colorFactory.newRandomRingColor());
    ringEndColor.push(colorFactory.newRandomRingColor());
  }

  centreStartColor = colorFactory.newRandomCentreColor();
  centreEndColor = colorFactory.newRandomCentreColor();

  backgroundStartColor = colorFactory.newRandomBackgroundColor();
  backgroundEndColor = colorFactory.newRandomBackgroundColor();
}

function drawShapes() {
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
      let centreColor = lerpColor(
        centreStartColor,
        centreEndColor,
        shapesColorMix
      );
      drawCircle(outerRadius, centreColor);
    }
  }
}

function drawRing(outerRadius, color, backgroundColor) {
  let outerDiameter = outerRadius * 2; // Calculate diameter
  let innerRadius = outerRadius - ringWidth; // Calculate radius for each ring
  let innerDiameter = innerRadius * 2; // Calculate diameter

  drawGlow(outerDiameter, color);

  // ==========================================================================
  // the ring
  // ==========================================================================
  beginShape();
  noStroke();
  fill(color); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);
  // draw the "inner ring" filled with the canvas background color
  fill(backgroundColor); // Set fill color to the background color
  ellipse(centerX, centerY, innerDiameter, innerDiameter);
  endShape();
}

function drawCircle(outerRadius, color) {
  let outerDiameter = outerRadius * 2; // Calculate diameter

  drawGlow(outerDiameter, color);

  beginShape();
  noStroke();
  // stroke(255, 255, 255, 45);
  // strokeWeight(overlap);
  fill(color); // Set fill color to the generated pastel color
  ellipse(centerX, centerY, outerDiameter, outerDiameter);
  endShape();

  beginShape();
  noFill();
}

function drawGlow(outerDiameter, color) {
  // ==========================================================================
  // the glow
  // ==========================================================================
  // draw the light "glow" around the outside of the ring
  beginShape();
  let h = color.levels[0];
  let s = color.levels[1];
  let b = color.levels[2];

  colorMode(RGB);
  noFill();

  let scaler = (s / 100) * (b / 100);

  stroke(225, 225, 255, 7);
  let outlines = 20 * scaler;
  for (let outline = 0; outline < outlines; outline += 2) {
    strokeWeight(outline);
    ellipse(centerX, centerY, outerDiameter + outline, outerDiameter + outline);
  }
  colorMode(HSB);

  endShape();
}

function rotateColors() {
  for (let i = 0; i < numRings; i++) {
    ringStartColor[i] = ringEndColor[i];
    ringEndColor[i] = colorFactory.newRandomRingColor();
  }

  centreStartColor = centreEndColor;
  centreEndColor = colorFactory.newRandomCentreColor();
}

function rotateBackgroundColor() {
  backgroundStartColor = backgroundEndColor;
  backgroundEndColor = colorFactory.newRandomBackgroundColor();
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

  drawShapes();

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
