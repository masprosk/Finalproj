$(document).ready(function() {

    const movableObject = $('#movable-object');
    const starterHitbox = $('#starter-hitbox');
    const container = $('.container');
    const questionBox = $('#question-box');

    let objectX = 0, objectY = 0; // Initial position of the movable object at the top-left corner of the container
    const moveSpeed = 20; // Speed of movement (increased for faster movement)

    // Get the container dimensions for hitbox placement
    const containerWidth = container.width();
    const containerHeight = container.height();

    // Set initial position of the movable object
    movableObject.css({ top: objectY, left: objectX });

    // Set the position of the starter hitbox to the center of the container
    const hitboxX = (containerWidth / 2) - 25; // Center of the container (subtract half the width of the hitbox)
    const hitboxY = (containerHeight / 2) - 25; // Center of the container (subtract half the height of the hitbox)
    starterHitbox.css({ top: hitboxY, left: hitboxX });

    // Event listener to handle arrow key movements
    $(document).keydown(function (e) {
        let moveParams = {};

        switch (e.key) {
            case 'ArrowUp':
                if (objectY > 0) objectY -= moveSpeed;
                break;
            case 'ArrowDown':
                if (objectY < containerHeight - 30) objectY += moveSpeed;
                break;
            case 'ArrowLeft':
                if (objectX > 0) objectX -= moveSpeed;
                break;
            case 'ArrowRight':
                if (objectX < containerWidth - 30) objectX += moveSpeed;
                break;
        }

        // Animate the movement of the movable object using jQuery
        movableObject.stop(true, true).animate({
            top: objectY,
            left: objectX
        }, 20); // A very small duration (20ms) for smoother movement

        // Check for collision with all hitboxes
        checkCollisions();
    });

    // Function to check if two elements collide
    function checkCollision(obj1, obj2) {
        const obj1Rect = obj1.getBoundingClientRect();
        const obj2Rect = obj2.getBoundingClientRect();

        return !(obj1Rect.right < obj2Rect.left ||
            obj1Rect.left > obj2Rect.right ||
            obj1Rect.bottom < obj2Rect.top ||
            obj1Rect.top > obj2Rect.bottom);
    }

    // Function to handle collisions with all hitboxes
    function checkCollisions() {
        // Check collision with the starter hitbox
        if (checkCollision(movableObject[0], starterHitbox[0])) {
            handleHitboxInteraction(starterHitbox[0], 'starter');
        }

        // Check collision with the left and right hitboxes
        $('.hitbox').each(function () {
            const hitbox = $(this);
            if (hitbox.hasClass('left-hitbox') && checkCollision(movableObject[0], hitbox[0])) {
                handleHitboxInteraction(hitbox[0], 'left');
            }
            if (hitbox.hasClass('right-hitbox') && checkCollision(movableObject[0], hitbox[0])) {
                handleHitboxInteraction(hitbox[0], 'right');
            }
        });
    }

    // Function to handle interaction with hitboxes
    function handleHitboxInteraction(hitbox, type) {
        if (type === 'starter') {
            // Hide the starter hitbox
            starterHitbox.hide();

            // Create new hitboxes at the top-left and top-right corners of the container
            createNewHitbox(0, 0, 'left'); // Top-left corner
            createNewHitbox(containerWidth - 50, 0, 'right'); // Top-right corner

            // Show the question box after interaction
            questionBox.show();
        } else if (type === 'left') {
            $(hitbox).addClass('green'); // Turn the left hitbox green
            questionBox.text('Correct!'); // Change the textbox content
        } else if (type === 'right') {
            $(hitbox).addClass('red'); // Turn the right hitbox red
            questionBox.text('Incorrect!'); // Change the textbox content
        }
    }

    // Function to create new hitboxes
    function createNewHitbox(x, y, type) {
        const newHitbox = $('<div class="hitbox"></div>');
        newHitbox.css({ top: y, left: x });

        // Add specific type classes for styling
        if (type === 'left') {
            newHitbox.addClass('left-hitbox');
            createAnswerLabel(x, y, 'Answer A');  // Create label for "Answer A"
        } else if (type === 'right') {
            newHitbox.addClass('right-hitbox');
            createAnswerLabel(x - 75, y, 'Answer B');  // Adjust this value to move Answer B label more to the left
        }

        container.append(newHitbox);
    }

    // Function to create answer label next to the hitboxes
    function createAnswerLabel(x, y, text) {
        const label = $('<div class="answer-label"></div>').text(text);
        label.css({
            top: y + 15, // Position the label to the right of the hitbox
            left: x + 55  // Adjust this value to place the label to the right of the hitbox
        });

        // Adjust "Answer B" label to be farther to the right
        if (text === 'Answer B') {
            label.css({
                left: x - 40 + 30  // Move the "Answer B" label 40px to the left from the right hitbox, then move it 30px right
            });
        }

        container.append(label);
    }
});
