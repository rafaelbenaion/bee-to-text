// vehicle.js

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 7;
    this.maxForce = 1;
    this.r = 10; // Size corresponds to the image dimensions
    this.target = null; // Initialize target as null
    this.isHovered = false;  // Hover state
    this.isHighlighted = false;  // Highlight state
    this.isExploding = false;  // Explosion state
    this.fadeAlpha = 255;  // Opacity for fading out
    this.explosionSize = this.r * 2; // Initial size for explosion animation
    this.explosionGrowthRate = 3; // Speed of growth during explosion
    this.isRemoved = false; // Flag to indicate if the vehicle has been removed
    this.isBlue = false; // New property to track if the bee is blue
    this.blueImage = null; // To store the blue bee image
    this.randomMovement();
  }

  setTarget(target) {
    this.target = target; // Method to set the target
  }

  setBlueImage(image) {
    this.blueImage = image; // Method to set the blue bee image
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  pursue(vehicle) {
    if (this.target) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
    return this.randomMovement(); // Move randomly if no target
  }

  randomMovement() {
    // Randomly change the velocity to create movement
    let randomForce = createVector(random(-1, 1), random(-1, 1));
    randomForce.setMag(0.5); // Adjusted for smoother movement
    this.applyForce(randomForce); // Apply random force
    return randomForce;
  }

  arrive(target) {
    return this.seek(target, true);
  }

  flee(target) {
    // Implement flee behavior if needed
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      let brakingRadius = 100; // Brake radius

      // Draw the circle around the target
      // noFill();
      // stroke(255, 0, 0);
      // strokeWeight(1);
      // circle(target.x, target.y, brakingRadius * 2);

      let distance = force.mag();

      // Modify desiredSpeed if within the braking radius
      if (distance < brakingRadius) {
        desiredSpeed = map(distance, 0, brakingRadius, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // Handle explosion animation
    if (this.isExploding) {
      this.fadeAlpha -= 10;  // Decrease opacity for the fading effect
      this.explosionSize += this.explosionGrowthRate;  // Increase size for explosion effect

      if (this.fadeAlpha <= 0) {
        this.fadeAlpha = 0;  // Ensure alpha doesn't go below zero
        this.isRemoved = true;  // Mark the vehicle for removal
      }
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.isExploding) {
      // Explosion effect
      fill(255, 0, 0, this.fadeAlpha);  // Red with fading alpha during explosion
      noStroke();
      ellipse(0, 0, this.explosionSize); // Explosion growing size
    } else {
      // Draw Bee Image
      if (this.isHovered || this.isHighlighted) {
        // Use red bee image when hovered or highlighted
        if (beeRedImage) {
          // Rotate the bee based on velocity for direction
          let angle = this.vel.heading() + PI / 2;
          rotate(angle);
          imageMode(CENTER);
          image(beeRedImage, 0, 0, this.r * 2, this.r * 2); // Draw red bee image
        } else {
          // Fallback to programmatically drawn bee if red image not loaded
          this.drawBee(true);
        }
      } else if (this.isBlue && this.blueImage) { // Check if the bee is blue
        // Use blue bee image
        let angle = this.vel.heading() + PI / 2;
        rotate(angle);
        imageMode(CENTER);
        image(this.blueImage, 0, 0, this.r * 2, this.r * 2); // Draw blue bee image
      } else {
        // Use default bee image
        if (beeImage) {
          // Rotate the bee based on velocity for direction
          let angle = this.vel.heading() + PI / 2;
          rotate(angle);
          imageMode(CENTER);
          image(beeImage, 0, 0, this.r * 2, this.r * 2); // Draw default bee image
        } else {
          // Fallback to programmatically drawn bee if default image not loaded
          this.drawBee(false);
        }
      }
    }
    pop();
  }

  drawBee(isRed) {
    // Programmatically draw a simple bee as a fallback
    // Body
    if (isRed) {
      fill(255, 0, 0); // Red color
    } else {
      fill(255); // White color
    }
    noStroke();
    ellipse(0, 0, this.r * 2, this.r); // Horizontal ellipse for body

    // Stripes
    stroke(0);
    strokeWeight(2);
    line(-this.r, 0, this.r, 0); // Horizontal stripe

    // Wings
    noFill();
    if (isRed) {
      stroke(255, 0, 0, 150); // Semi-transparent red
    } else {
      stroke(255, 255, 255, 150); // Semi-transparent white
    }
    strokeWeight(1);
    ellipse(-this.r / 2, -this.r / 2, this.r, this.r / 2); // Left wing
    ellipse(this.r / 2, -this.r / 2, this.r, this.r / 2); // Right wing

    // Head
    fill(255);
    noStroke();
    ellipse(this.r, 0, this.r / 2, this.r / 2); // Small head

    // Eyes
    fill(0);
    ellipse(this.r + 2, -2, 2, 2); // Left eye
    ellipse(this.r + 2, 2, 2, 2); // Right eye
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }

  isMouseOver() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    return d < this.r * 2;  // Check if mouse is over the vehicle
  }

  startExplosion() {
    if (!this.isExploding) { // Prevent restarting explosion
      this.isExploding = true;  // Start the explosion animation
    }
  }

  isFullyExploded() {
    return this.isRemoved;  // Explosion complete when marked for removal
  }
}