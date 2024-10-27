// sketch.js

let vehicles = [];
let targets = [];
let letter = '';
let font;
let inputBox;
let addButton;
let startButton;
let beeImage;      // Variable to hold the default bee image
let beeRedImage;   // Variable to hold the red bee image

// Variables for the "+" button press limit
let addButtonMaxPresses = 0; // Will be set based on number of targets
let addButtonPresses = 0;    // Number of times the "+" button has been pressed
let countDisplay;            // HTML element to display the remaining presses

// Popup elements
let outOfBeePointsPopup;
let hintPopup; // New Hint Popup

function preload() {
  // Load a local font
  font = loadFont('myFont.ttf', fontLoaded, fontFailed);
  
  // Load default bee image
  beeImage = loadImage('assets/bee.png', beeImageLoaded, beeImageFailed);
  
  // Load red bee image
  beeRedImage = loadImage('assets/bee_red.png', beeRedImageLoaded, beeRedImageFailed);
}

function beeImageLoaded() {
  console.log("Bee image loaded successfully.");
}

function beeImageFailed() {
  console.error("Error loading bee image. Make sure the image file is available in the assets folder.");
}

function beeRedImageLoaded() {
  console.log("Red bee image loaded successfully.");
}

function beeRedImageFailed() {
  console.error("Error loading red bee image. Make sure the image file is available in the assets folder.");
}

function fontLoaded() {
  console.log("Font loaded successfully.");
}

function fontFailed() {
  console.error("Error loading font. Make sure the font file is available.");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // Use the window size

  // Create vehicles at random positions
  for (let i = 0; i < 80; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }

  // Add the "Start" button in the middle of the screen
  startButton = createButton('Start');
  startButton.position(windowWidth / 2 - 75, windowHeight / 2 - 25); // Center the button
  startButton.style('width', '150px');
  startButton.style('height', '50px');
  startButton.style('font-size', '20px');
  startButton.style('background-color', '#444');
  startButton.style('color', '#fff');
  startButton.style('border', 'none');
  startButton.style('border-radius', '10px');
  startButton.mousePressed(startApp); // Call startApp when pressed
  startButton.mouseOver(() => {

      startButton.style('background-color', '#ff0000'); // Red on hover
    
  });
  startButton.mouseOut(() => {

      startButton.style('background-color', '#444'); // Reset when not hovering
  
  });

  // Add a text box to change the letter
  inputBox = createInput(letter);
  inputBox.position(windowWidth * 0.1, windowHeight - 80); // Initial position (10% from left)
  inputBox.style('position', 'absolute'); // Make it float over the canvas
  inputBox.style('bottom', '30px'); // 30px from the bottom of the screen
  inputBox.style('left', '10%'); // 10% from the left side
  inputBox.style('width', '70%'); // Adjust width to 70% of the screen to leave space for the button
  inputBox.style('padding', '15px'); // Add padding for comfort
  inputBox.style('border-radius', '30px'); // Rounded borders
  inputBox.style('border', 'none'); // Remove default border
  inputBox.style('outline', 'none'); // Remove default outline
  inputBox.style('background-color', '#333'); // Similar gray background
  inputBox.style('color', '#fff'); // White text
  inputBox.style('font-size', '16px'); // Font size
  inputBox.attribute('placeholder', 'Type your message here'); // Placeholder text
  inputBox.style('display', 'none'); // Hide initially
  inputBox.input(updateLetter);

  // Add a circular button to add vehicles with a "+"
  addButton = createButton('+'); // "+" symbol
  addButton.position(windowWidth * 0.85, windowHeight - 80); // Position next to the text box
  addButton.style('position', 'absolute'); // Float over the canvas
  addButton.style('bottom', '30px'); // 30px from the bottom of the screen
  addButton.style('left', '85%'); // Next to the text box (85% left)
  addButton.style('width', '50px'); // Width of the circular button
  addButton.style('height', '50px'); // Height of the circular button (same as width for a circle)
  addButton.style('border-radius', '50%'); // Rounded borders to make a circle
  addButton.style('border', 'none'); // No border
  addButton.style('outline', 'none'); // No outline
  addButton.style('background-color', '#666'); // Background color
  addButton.style('color', '#fff'); // Text color "+"
  addButton.style('font-size', '24px'); // Text size "+"
  addButton.style('display', 'none'); // Ensure it's hidden initially

  // Flexbox to center content inside the button
  addButton.style('justify-content', 'center'); // Center horizontally
  addButton.style('align-items', 'center'); // Center vertically

  // Red hover effect for the "+" button
  addButton.mouseOver(() => {
    if (addButtonPresses < addButtonMaxPresses) {
      addButton.style('background-color', '#ff0000'); // Red on hover
    }
  });
  addButton.mouseOut(() => {
    if (addButtonPresses < addButtonMaxPresses) {
      addButton.style('background-color', '#666'); // Reset when not hovering
    }
  });

  addButton.mousePressed(addRandomVehicles); // Function triggered on button click

  // Create the count display
  countDisplay = createDiv(`${addButtonMaxPresses - addButtonPresses}`);
  countDisplay.style('position', 'absolute');
  countDisplay.style('bottom', '90px'); // Positioned above the "+" button (30px + 50px + 10px)
  countDisplay.style('left', '85%'); // Same as addButton left (85%)
  countDisplay.style('width', '50px');
  countDisplay.style('text-align', 'center');
  countDisplay.style('color', '#fff'); // White color initially
  countDisplay.style('font-size', '16px');
  countDisplay.style('pointer-events', 'none'); // Make it non-interactive
  countDisplay.style('background-color', 'transparent'); // No background
  countDisplay.style('margin-bottom', '5px'); // Spacing
  countDisplay.style('font-weight', 'bold'); // Bold text
  countDisplay.style('height', '20px'); // Set height
  countDisplay.style('line-height', '20px'); // Center text vertically
  countDisplay.style('width', '50px'); // Same as addButton width
  countDisplay.hide(); // Hide initially

  // Create the "Out of Bee Points" popup
  outOfBeePointsPopup = createDiv("You are out of bee points, write more to get more points.");
  outOfBeePointsPopup.style('position', 'absolute');
  outOfBeePointsPopup.style('bottom', '100px'); // Positioned above the input box (30px + 50px + 20px)
  outOfBeePointsPopup.style('left', '50%');
  outOfBeePointsPopup.style('transform', 'translateX(-50%)');
  outOfBeePointsPopup.style('padding', '10px 20px');
  outOfBeePointsPopup.style('background-color', '#333'); // Dark background
  outOfBeePointsPopup.style('color', '#ff0000'); // Red text
  outOfBeePointsPopup.style('font-size', '20px'); // Text size
  outOfBeePointsPopup.style('border', '2px solid #ff0000'); // Red border
  outOfBeePointsPopup.style('border-radius', '30px');
  outOfBeePointsPopup.style('display', 'none'); // Hidden initially

  // Create the "Hint" popup
  hintPopup = createDiv("Hint: You can kill bees by hovering over them and doing a left-click.");
  hintPopup.style('position', 'absolute');
  hintPopup.style('bottom', '110px'); // Positioned above the "Out of Bee Points" popup
  hintPopup.style('left', '50%');
  hintPopup.style('transform', 'translateX(-50%)');
  hintPopup.style('padding', '10px 20px');
  hintPopup.style('background-color', '#333'); // Dark background
  //yellow text
  hintPopup.style('color', '#ffcc00');
  hintPopup.style('font-size', '16px'); // Text size
  hintPopup.style('border', '2px solid #ffcc00'); // Yellow border for distinction
  hintPopup.style('border-radius', '10px');
  hintPopup.style('display', 'block'); // Visible initially
}

function startApp() {
  // Hide the start button and show input and add button
  startButton.hide();
  inputBox.style('display', 'block');
  addButton.style('display', 'flex'); // Show the + button after clicking "Start"
  countDisplay.style('display', 'block'); // Show the count display

  // Hide the "Hint" popup
  hintPopup.style('display', 'none');
}

function draw() {
  background(0);

  // Display the targets
  fill(0, 0, 0);
  noStroke();
  for (let target of targets) {
    ellipse(target.x, target.y, 32);
  }

  // Apply arrive behavior for each vehicle towards its respective target
  for (let i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[i];
    let target = targets[i % targets.length]; // Vehicles take targets in order
    if (target) {
      let steering = vehicle.arrive(target);
      vehicle.applyForce(steering);
    }

    // Update the position
    vehicle.update();
    vehicle.edges();
  }

  // Handle the hover and highlighting
  let hoveredVehicle = null;
  let radius = 100; // Radius for highlighting and repelling

  // First, reset hover and highlight status
  for (let vehicle of vehicles) {
    vehicle.isHovered = false;
    vehicle.isHighlighted = false;
  }

  // Find the hovered vehicle
  for (let vehicle of vehicles) {
    if (vehicle.isMouseOver()) {
      vehicle.isHovered = true;
      hoveredVehicle = vehicle;
      break; // Only one vehicle can be hovered at a time
    }
  }

  // If we have a hovered vehicle, highlight nearby vehicles and apply repelling force
  if (hoveredVehicle) {
    for (let vehicle of vehicles) {
      let d = p5.Vector.dist(vehicle.pos, hoveredVehicle.pos);
      if (d <= radius && vehicle !== hoveredVehicle) { // Exclude the hovered vehicle itself
        vehicle.isHighlighted = true;
        
        // Calculate repelling force
        let repelForce = p5.Vector.sub(vehicle.pos, hoveredVehicle.pos);
        let distance = repelForce.mag();
        if (distance > 0) { // Prevent division by zero
          repelForce.normalize();
          // The closer the vehicle, the stronger the repelling force
          let forceMagnitude = map(distance, 0, radius, 2, 0.5);
          repelForce.mult(forceMagnitude);
          vehicle.applyForce(repelForce);
        }
      }
    }
  }

  // Now, show the vehicles
  for (let vehicle of vehicles) {
    vehicle.show();
  }

  // **Handle Vehicle Removal After Explosion**
  vehicles = vehicles.filter(vehicle => !vehicle.isRemoved);

  // **Check if More Targets Than Vehicles and Display Popup**
  if (targets.length > vehicles.length) {
    displayPopup("You need more bees, click on + button.");
  } else {
    // Optionally hide the top popup if it's visible and condition no longer holds
    // This can be implemented if you want the popup to disappear automatically
  }
}

function mousePressed() {
  // **Modified mousePressed Function**
  // Trigger explosion on all red vehicles (isHovered or isHighlighted)
  for (let vehicle of vehicles) {
    if (vehicle.isHovered || vehicle.isHighlighted) {
      vehicle.startExplosion(); // Trigger the explosion animation
    }
  }

  // **Removed vehicle removal logic from here**
  // Removal is now handled in the draw() loop after the explosion animation
}

function addRandomVehicles() {
  if (addButtonPresses < addButtonMaxPresses) {
    // Add 60 random vehicles
    for (let i = 0; i < 60; i++) {
      vehicles.push(new Vehicle(random(width), random(height)));
    }
    
    // Increment the press count
    addButtonPresses++;
    let remaining = addButtonMaxPresses - addButtonPresses;
    countDisplay.html(remaining);
    
    // Check if presses have reached the maximum
    if (remaining <= 0) {
      // Disable the button
      addButton.style('background-color', '#ff0000'); // Red
      addButton.style('color', '#ff0000'); // Make text also red
      countDisplay.style('color', '#ff0000'); // Red color for count
      addButton.attribute('disabled', ''); // Disable the button
      addButton.style('cursor', 'not-allowed'); // Show not-allowed cursor
      
      // Show the "Out of Bee Points" popup
      outOfBeePointsPopup.style('display', 'block');
    }
  }
}

function defineTargets(letter) {
  targets = [];
  if (font) {
    let points = font.textToPoints(letter, 100, 400, 192, {
      sampleFactor: 0.1, // Increase or decrease for more or fewer points
      simplifyThreshold: 0
    });

    if (points.length > 0) {
      for (let pt of points) {
        targets.push(createVector(pt.x, pt.y));
      }
      
      // Set the maximum number of presses based on the number of targets
      addButtonMaxPresses = Math.ceil((targets.length * 1.5) / 60); // 1.5 times the number of targets divided by 60

      // Reset the press count
      addButtonPresses = 0;
      
      // Update the count display
      countDisplay.html(addButtonMaxPresses - addButtonPresses);
      countDisplay.style('color', '#fff'); // Reset color to white

      // Enable the "+" button if it was previously disabled
      addButton.removeAttribute('disabled');
      addButton.style('background-color', '#666'); // Reset background color
      addButton.style('color', '#fff'); // Reset text color
      addButton.style('cursor', 'pointer'); // Reset cursor

      // Hide the "Out of Bee Points" popup if visible
      outOfBeePointsPopup.style('display', 'none');
    } else {
      console.error("No points found for the specified letter.");
      
      // If no points found, set press limit to 0 and disable the button
      addButtonMaxPresses = 0;
      addButtonPresses = 0;
      countDisplay.html(addButtonMaxPresses - addButtonPresses);
      countDisplay.style('color', '#ff0000'); // Red color for count
      addButton.style('background-color', '#ff0000'); // Red
      addButton.style('color', '#ff0000'); // Red text
      addButton.attribute('disabled', ''); // Disable the button
      addButton.style('cursor', 'not-allowed'); // Not-allowed cursor
      
      // Show the "Out of Bee Points" popup
      outOfBeePointsPopup.style('display', 'block');
    }
  } else {
    console.error("Font not loaded, unable to define targets.");
  }
}

function updateLetter() {
  letter = inputBox.value();
  defineTargets(letter);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas when the window is resized
  inputBox.position(windowWidth * 0.1, windowHeight - 80); // Reposition the input when resizing
  inputBox.style('bottom', '30px'); // Adjust the height to 30px from the bottom when resizing
  addButton.position(windowWidth * 0.85, windowHeight - 80); // Reposition the button
  addButton.style('bottom', '30px'); // Adjust the button height to 30px from the bottom when resizing
  countDisplay.position(windowWidth * 0.85, windowHeight - 80 - 50); // Reposition the count display above the button
  outOfBeePointsPopup.position(width / 2 - outOfBeePointsPopup.size().width / 2, height - 100); // Reposition the popup above the input box
  hintPopup.position(width / 2 - hintPopup.size().width / 2, height - 110); // Reposition the hint popup above the "Out of Bee Points" popup
}

// **New Function to Display Popup Message**
function displayPopup(message) {
  // Define popup dimensions
  let popupWidth = 405;
  let popupHeight = 45;

  // Position: top center
  let x = width / 2 - popupWidth / 2;
  let y = 20; // 20 pixels from the top

  // Draw background rectangle with some transparency
  fill(50, 200); // Dark gray with some transparency
  stroke(255, 0, 0); // Red border
  strokeWeight(2);
  rect(x, y, popupWidth, popupHeight, 30); // Rounded corners

  // Draw the message text
  noStroke();
  // Red text
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(message, width / 2, y + popupHeight / 2);
}