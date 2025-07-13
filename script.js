document.addEventListener('DOMContentLoaded', function () {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0; 
    let gameStarted = false; 
    let food = { x: 300, y: 200 }; 
    let snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}]; 
    let poison = { x: -1, y: -1 }; // Initialize poison

    let dx = cellSize; // +20
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;
    
    function resetGame() {
        alert('Game Over' + '\n' + 'Your Score: ' + score);
        score = 0;
        gameStarted = false;
        food = { x: 300, y: 200 };
        snake = [{x: 160, y: 200}, {x: 140, y: 200}, {x: 120, y: 200}];
        dx = cellSize;
        dy = 0;
        gameSpeed = 200;
        clearInterval(intervalId);
        drawFoodAndSnake();
        drawScoreBoard();
        poison = { x: -1, y: -1 }; // Reset poisonElement
        const poisonElements = document.getElementsByClassName('poison');
        while(poisonElements.length > 0) {
            poisonElements[0].parentNode.removeChild(poisonElements[0]); // Remove all poison elements
        }
        document.getElementsByClassName('start-button')[0].style.display = 'block'; // Show start button again
    }

    function moveFood() {
        let newX, newY;

        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));

        food = { x: newX, y: newY };
    }
    
    function movePoison() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while(snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY) || (newX === food.x && newY === food.y));

        poison = { x: newX, y: newY };
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // Add new head to the snake

        // check collision with food
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 20;
            moveFood();
            if(score >= 100) {
                movePoison();
            }

            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 5;
                gameLoop();
            }
        } else {
            snake.pop(); // Remove tail
        }
    }

    function changeDirection(e) {
        // console.log("key pressed", e);
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key === 'ArrowUp' && !isGoingDown ) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // Clear the game arena
        // wipe out everything and redraw with new positions

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        // snake collision checks
        for(let i = 1; i < snake.length; i++) {
            if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true;
            }
        }
        // poison collision checks
        if(poison.x !== 0 && poison.y !== 0) {
            if(snake[0].x === poison.x && snake[0].y === poison.y) {
                return true;
            }
        }
        // wall collision checks
        const hitLeftWall = snake[0].x < 0; // snake[0] -> head
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if(isGameOver()) {
                resetGame();
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
            if(poison.x !== -1 && poison.y !== -1) {
                const poisonElement = drawDiv(poison.x, poison.y, 'poison');
                gameArena.appendChild(poisonElement);
            }
        }, gameSpeed);
    }

    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            
            gameLoop(); // TODO: Implement game loop
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function initiateGame() {
        const scoreBoard = document.createElement('div'); 
        scoreBoard.id = 'score-board';

        document.body.insertBefore(scoreBoard, gameArena); // Insert score board before game arena


        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function startGame() {
            startButton.style.display = 'none'; // Hide start button

            runGame();
        });

        document.body.appendChild(startButton); // Append start button to the body
    }

    initiateGame();
    
});