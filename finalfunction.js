$(document).ready(function () {
    let timeLeft = 10;
    let clicks = 0;
    let totalScore = 0;
    let timer;
    let gameStarted = false;
    let clickMultiplier = 1;
    let isSecondRound = false;

    const shapiroImage = 'url("images/shapiroFace.JPG")';
    const petticeImage = 'url("images/pettice_mary.jpg")';

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
            $('body, h1').css('color', 'lightgreen');
            $('#gameContainer').css('border', '10px outset #33ff99');
            updateKeyframes('#33ff99', 'rgba(51, 255, 153, 0.3)', 'rgba(51, 255, 153, 0.5)');
            
        } else {
            clickMultiplier = 1.5;  // Pettice multiplier
            alert("Keep trying! You earned the Pettice multiplier. Clicks are now halved.");
            $('#gameContainer').css('background-image', petticeImage);
            $('body, h1').css('color', 'lightcoral');
            $('#gameContainer').css('border', '10px outset rgb(133, 20, 20)');
            updateKeyframes('rgb(133, 20, 20)', 'rgba(133, 20, 20, 0.3)', 'rgba(133, 20, 20, 0.5)');
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
});
