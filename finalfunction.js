$(document).ready(function () {
    let timeLeft = 10;
    let clicks = 0;
    let totalScore = 0;
    let timer;
    let gameStarted = false;
    let clickMultiplier = 1;
    let isSecondRound = false;
    let word = "ADVENTURE"; // Word to display for background

    const shapiroImage = 'url("images/shapiroFace.JPG")';
    const petticeImage = 'url("images/pettice_mary.jpeg")';

    // Initial purple keyframes setup
    updateKeyframes('#37218a', 'rgba(0, 17, 172, 0.3)', 'rgba(119, 0, 255, 0.5)');

    $('#clickButton').click(function () {
        if (!gameStarted) {
            gameStarted = true;
            startGame();
        }

        if (timeLeft > 0) {
            clicks += clickMultiplier;
            totalScore += clickMultiplier;
            $('#clickCount').text('Total Score: ' + totalScore);
        }
    });

    function startGame() {
        clearInterval(timer);

        timer = setInterval(function () {
            timeLeft--;
            $('#timer').text('Time left: ' + timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                $('#timer').text('Time’s up! Click total: ' + clicks);

                if (!isSecondRound) {
                    setTimeout(startSecondRound, 2000); // Brief pause before the second round
                } else {
                    alert('Game over! Your total score is: ' + totalScore);
                    $('#totrivia').show();
                    $('#totrivia2').show();
                }
            }
        }, 1000);
    }

    function startSecondRound() {
        isSecondRound = true;

        // Determine multiplier and set background based on first round's clicks
        if (clicks >= 50) {
            clickMultiplier = 2;  // Shapiro booster
            alert("Great job! You earned the Shapiro booster! Clicks are now doubled.");
            $('#gameContainer').css('background-image', shapiroImage);
            $('body, h1, #clickCount, #timer').css('color', 'lightgreen');
            $('#clickButton, #resetButton').css('background-color', 'lightgreen');
            $('#gameContainer, #clickButton, #resetButton').css('border', '10px outset #33ff99');
            updateKeyframes('#33ff99', 'rgba(51, 255, 153, 0.3)', 'rgba(51, 255, 153, 0.5)');
            word = "SHAPIRO";
            root.wavecolor = { r: 51, g: 255, b: 153 };
            
        } else {
            clickMultiplier = 1.5;  // Pettice multiplier
            alert("Keep trying! You earned the Pettice multiplier. Clicks are now halved.");
            $('#gameContainer').css('background-image', petticeImage);
            $('body, h1, #clickCount, #timer').css('color', 'lightcoral');
            $('#clickButton, #resetButton').css('background-color', 'lightcoral');
            $('#gameContainer, #clickButton, #resetButton').css('border', '10px outset rgb(133, 20, 20)');
            updateKeyframes('rgb(133, 20, 20)', 'rgba(133, 20, 20, 0.3)', 'rgba(133, 20, 20, 0.5)');
            word = "PETTICE";
            root.wavecolor = { r: 133, g: 20, b: 20 };
        }

        // Reset for the second round
        timeLeft = 10;
        gameStarted = false;

        $('#clickCount').text('Total Score: ' + totalScore);
        $('#timer').text('Time left: ' + timeLeft);

        // Start second round on the next click
        $('#clickButton').one('click', function () {
            gameStarted = true;
            startGame();
        });
    }

    // Function to dynamically update keyframes for textGlow and pulse
    function updateKeyframes(textGlowColor, pulseColorStart, pulseColorEnd) {
        $('#dynamicKeyframes').remove();

        const keyframes = `
            @keyframes dynamicTextGlow {
                0% { text-shadow: 0 0 5px ${textGlowColor}, 0 0 10px ${textGlowColor}; }
                50% { text-shadow: 0 0 15px ${textGlowColor}, 0 0 30px ${textGlowColor}; }
                100% { text-shadow: 0 0 5px ${textGlowColor}, 0 0 10px ${textGlowColor}; }
            }

            @keyframes dynamicPulse {
                0% { transform: scale(1); box-shadow: 0px 8px 30px ${pulseColorStart}; }
                100% { transform: scale(1.02); box-shadow: 0px 8px 40px ${pulseColorEnd}; }
            }
        `;

        $('<style>', { id: 'dynamicKeyframes', text: keyframes }).appendTo('head');

        $('h1').css('animation', 'dynamicTextGlow 1.5s infinite');
        $('#gameContainer').css('animation', 'dynamicPulse 2s infinite alternate');
    }

    //Matrix Background
    let root = {
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
        let characters = word.split(""); // Random letters come from this word
        
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
      
});
