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
            clicks += 1;
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
                    let clickspersecond = clicks / 20;
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
    const character = $('#character');
    const answers = $('.answer');
    const gameArea = $('#gameArea');

    // Provided question pools
    const klineqanda = [
        { question: "Where is Kline's office?", correctAnswer: 'Clyde A. Lynch 120-A', answers: ['Clyde A. Lynch 120-A', 'Clyde A. Lynch 120-B', 'Clyde A. Lynch 121-A', 'Clyde A. Lynch 121-B'] },
        { question: "Where did Dr. Kline receive his Ph.D?", correctAnswer: 'Temple University', answers: ['Temple University', 'Texas Tech University', 'Tulane University', 'Trinity College Dublin'] },
        { question: "What specific practice areas does he teach at LVC?", correctAnswer: 'User Experience/ UX', answers: ['User Experience/ UX', 'Interactive Storytelling', 'Motion Graphics', 'Graphic Design'] },
        { question: "Which email is Dr. Kline's correct email?", correctAnswer: 'jkline@lvc.edu', answers: ['kline@lvc.edu', 'jkline@lvc.edu', 'joelk@lvc.edu', 'kline@jlvc.edu'] },
        { question: "Did Kline get his B.S., B.A. at Lebanon Valley College?", correctAnswer: 'True', answers: ['True', 'False', 'Who is Kline', 'What is B.S. B.A.'] },
        { question: "What is Kline's phone number?", correctAnswer: '717-867-6108', answers: ['717-867-5309', '717-324-5674', '717-867-6108', '717-310-4561'] },
        { question: "Where in the world does Kline want to retire to?", correctAnswer: 'Cayman Islands', answers: ['His house', 'Canada', 'Hawaii', 'Cayman Islands'] },
        { question: "What are Kline's Dog Names?", correctAnswer: 'Sophie & Maisy', answers: ['Sarah & Maisy', 'Sophie & Maya', 'Sophie & Maisy', 'Sarah & Maya'] },
        { question: "Which of these classes does Kline teach?", correctAnswer: 'DCOM-131', answers: ['DCOM-130', 'DCOM-270', 'DCOM-400', 'DCOM-131'] },
        { question: "How does Kline start most stories?", correctAnswer: 'So I had this Girlfriend', answers: ['Back in college', 'So I had this Girlfriend', 'This one time', 'So way back when'] },
    ];

    const richieqanda = [
        { question: "Where is Dr. Richie's office?", correctAnswer: 'Clyde A. Lynch 119-A', answers: ['Clyde A. Lynch 119-A', 'Clyde A. Lynch 119-B', 'Clyde A. Lynch 118-A', 'Clyde A. Lynch 118-B'] },
        { question: "Dr. Ritchie is the Chair and Professor of Design, Marketing, and Technology?", correctAnswer: 'True', answers: ['True', 'No', 'False', 'Yes'] },
        { question: "What is Ritchie's phone number?", correctAnswer: '717-867-6249', answers: ['717-867-6492', '717-867-5309', '717-867-6249', '717-249-6678'] },
        { question: "How many connections does Ritchie have on LinkedIn?", correctAnswer: '500+', answers: ['600+', '700+', '800+', '500+'] },
        { question: "How many followers does Ritchie have on Twitter?", correctAnswer: '406', answers: ['404', '406', '400', '402'] },
        { question: "What is his favorite drink?", correctAnswer: 'Beer', answers: ['Water', 'Beer', 'Soda', 'Liquor'] },
        { question: "What did he originally teach?", correctAnswer: 'English', answers: ['Creative arts', 'Health', 'English', 'Spanish'] },
        { question: "Which email is Dr. Ritchie's correct email?", correctAnswer: 'ritchie@lvc.edu', answers: ['ritchiej@lvc.edu', 'ritchie@lvc.edu', 'richie@jlvc.edu', 'jritchie@lvc.edu'] },
        { question: "Which of these courses does Dr. Ritchie teach?", correctAnswer: 'Emerging Media', answers: ['Engaging Media', 'Evolving Media', 'Emerging Media', 'Experiential Media'] },
        { question: "Where did Dr. Ritchie receive his Ph.D?", correctAnswer: 'Arizona State University', answers: ['Alabama State University', 'Alvernia University', 'Arizona State University', 'Adams State University'] },
    ];

    // Game state variables
    let questions = [];
    let currentQuestionIndex = 0;
    let position = { top: 230, left: 230 }; // Character's starting position

    // Load question based on current index
    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            alert("Trivia Completed!");
            currentQuestionIndex = 0; // Reset for replay
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);

        $('#questionDisplay').text(currentQuestion.question);

        answers.each((index, element) => {
            $(element).text(shuffledAnswers[index]);
            $(element).data('correct', shuffledAnswers[index] === currentQuestion.correctAnswer);
        });
    }

    // Check if character collides with an answer
    function checkCollision() {
        const charRect = character[0].getBoundingClientRect();
        const gameRect = gameArea[0].getBoundingClientRect();

        answers.each(function () {
            const answerRect = this.getBoundingClientRect();

            if (
                charRect.left >= gameRect.left &&
                charRect.right <= gameRect.right &&
                charRect.top >= gameRect.top &&
                charRect.bottom <= gameRect.bottom &&
                charRect.left < answerRect.right &&
                charRect.right > answerRect.left &&
                charRect.top < answerRect.bottom &&
                charRect.bottom > answerRect.top
            ) {
                const isCorrect = $(this).data('correct');
                alert(isCorrect ? "Correct!" : "Wrong!");

                currentQuestionIndex++;
                loadQuestion();
                resetCharacterPosition();
            }
        });
    }

    // Reset character position to the center of the game area
    function resetCharacterPosition() {
        position = { top: 150, left: 250 };
        character.css({ top: `${position.top}px`, left: `${position.left}px` });
    }

    // Move character with arrow keys
    function moveCharacter(e) {
        const step = 30;
        const gameAreaWidth = gameArea.width();
        const gameAreaHeight = gameArea.height();

        if (e.key === "ArrowUp") position.top = Math.max(0, position.top - step);
        if (e.key === "ArrowDown") position.top = Math.min(gameAreaHeight - 40, position.top + step);
        if (e.key === "ArrowLeft") position.left = Math.max(0, position.left - step);
        if (e.key === "ArrowRight") position.left = Math.min(gameAreaWidth - 40, position.left + step);

        character.css({ top: `${position.top}px`, left: `${position.left}px` });
        checkCollision();
    }

    function bothbosses() {
        word = 'TRI';
        // Initialize an empty list to hold the selected questions
        let randomquestions = [];
    
        // Select 5 random questions from Ritchie's pool
        let ritchieRandomQuestions = [];
        while (ritchieRandomQuestions.length < 5) {
            let randomIndex = Math.floor(Math.random() * ritchieQuestions.length);
            if (!ritchieRandomQuestions.includes(ritchieQuestions[randomIndex])) {
                ritchieRandomQuestions.push(ritchieQuestions[randomIndex]);
            }
        }
    
        // Select 5 random questions from Kline's pool
        let klineRandomQuestions = [];
        while (klineRandomQuestions.length < 5) {
            let randomIndex = Math.floor(Math.random() * klineQuestions.length);
            if (!klineRandomQuestions.includes(klineQuestions[randomIndex])) {
                klineRandomQuestions.push(klineQuestions[randomIndex]);
            }
        }
    
        // Add the random questions to the questions list
        randomquestions.push(...ritchieRandomQuestions);
        randomquestions.push(...klineRandomQuestions);
    
        questions = randomquestions; // Ensure this is accessible to loadQuestion()
        alert(randomquestions)
        alert(questions)
    
        loadQuestion();
        $(document).on('keydown', moveCharacter);
    }
    
    function ritchieonly() {
        word = 'TRIVIA';
        questions = richieqanda; // Ensure richieqanda is defined and populated
        loadQuestion();
        $(document).on('keydown', moveCharacter);
    }
    
    let clickspersecond = 6;
    if (clickspersecond >= 6) {
        ritchieonly();
    } else {
        bothbosses();
    }
    
});
