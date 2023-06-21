function setup() {
  createCanvas(560, 560); // Adjust the canvas size as per your needs
}

function draw() {
  noLoop();

  let backgroundColour = 236;

  background(backgroundColour); // Set the background color

  let numRings = 3; // Number of concentric rings
  let ringWidth = 50; // Width of each ring
  let largestRadius = 250; // Radius of the largest ring
  let overlap = 10; // Amount of overlap between rings
  let centerX = width / 2; // X-coordinate of the center
  let centerY = height / 2; // Y-coordinate of the center

  // Draw the concentric rings
  for (let i = 0; i < numRings; i++) {
    let outerRadius = largestRadius - i * ringWidth; // Calculate radius for each ring
    let outerDiameter = outerRadius * 2; // Calculate diameter

    let innerRadius = outerRadius - ringWidth; // Calculate radius for each ring
    let innerDiameter = innerRadius * 2 - overlap; // Calculate diameter

    let hue = random(360); // Generate a random hue value
    let saturation = random(50, 70); // Generate a random saturation value within a pastel range
    let brightness = random(70, 90); // Generate a random brightness value within a pastel range
    let alpha = 123;

    let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values

    noStroke(); // Disable stroke for rings
    fill(ringColor); // Set fill color to the generated pastel color

    // Draw each ring
    ellipse(centerX, centerY, outerDiameter, outerDiameter);
    fill(backgroundColour); // Set fill color to the generated pastel color

    if (i !== numRings - 1) {
      // Draw each ring
      ellipse(centerX, centerY, innerDiameter, innerDiameter);
    }
  }
}
