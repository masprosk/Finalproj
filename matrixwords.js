const root = {
  wavecolor: { r: 119, g: 0, b: 200 },
  rainbowSpeed: 0.5,
  rainbow: false,
  matrixspeed: 80,
};

const canvas = document.getElementById("matrixCanvas");  // Correct canvas id here
const ctx = canvas.getContext("2d");

let hue = -0.01;
let fontSize = 18; // Initial font size
let columns, drops, firstPass;

// Initialize canvas dimensions and drops
function initialize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1); // Y positions of drops
  firstPass = Array(columns).fill(true); // Track first pass for each column
}
initialize();
window.addEventListener("resize", initialize);

// Word and characters setup
const word = "ADVENTURE"; // Word to display in order
const characters = word.split(""); // Random letters come from this word

// Create gradient for background fade
function createGradient() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
  return gradient;
}

// Draw function for the Matrix effect
function draw() {
  // Apply the gradient fade effect to the background
  ctx.fillStyle = createGradient();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Set font style based on the current font size
  ctx.font = `${fontSize}px 'Press Start 2P', sans-serif`;

  // Loop through each column
  for (let i = 0; i < drops.length; i++) {
      // Determine the character to print
      let text;
      if (firstPass[i]) {
          // Print characters from the word in order during the first pass
          const wordIndex = drops[i] - 1; // Adjust for array indexing
          text = wordIndex < word.length ? word[wordIndex] : characters[Math.floor(Math.random() * characters.length)];
          if (wordIndex >= word.length) {
              firstPass[i] = false; // End first pass once word is fully printed
          }
      } else {
          // Random letters from the word after the first pass
          text = characters[Math.floor(Math.random() * characters.length)];
      }

      // Set text color (rainbow or static)
      if (root.rainbow) {
          hue += root.rainbowSpeed / 100;
          const r = Math.floor(127 * Math.sin(hue) + 128);
          const g = Math.floor(127 * Math.sin(hue + 2) + 128);
          const b = Math.floor(127 * Math.sin(hue + 4) + 128);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
          ctx.fillStyle = `rgb(${root.wavecolor.r}, ${root.wavecolor.g}, ${root.wavecolor.b})`;
      }

      // Draw the character
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);

      // Reset drop position randomly
      if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          firstPass[i] = true; // Reset to print the word in order again
      }

      // Increment drop
      drops[i]++;
  }
}

// Start the animation
setInterval(draw, root.matrixspeed);
