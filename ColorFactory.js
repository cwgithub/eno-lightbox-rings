class ColorFactory {
  newRandomRingColor() {
    let hue = random(0, 360);
    let saturation = random(80, 100);
    let brightness = random(90, 100);
    let alpha = random(0, 255);
    let ringColor = color(hue, saturation, brightness, alpha); // Create a color object with the generated values
    return ringColor;
  }

  newRandomCentreColor() {
    let hue = random(0, 360);
    let saturation = random(50, 100);
    let brightness = random(75, 100);
    let alpha = 255; // random(200, 255);
    return color(hue, saturation, brightness, alpha); // Create a color object with the generated values
  }

  newRandomBackgroundColor() {
    let hue = random(0, 180);
    let saturation = random(0, 100);
    let brightness = random(75, 100);
    let ringColor = color(hue, saturation, brightness); // Create a color object with the generated values
    return ringColor;
  }
}
