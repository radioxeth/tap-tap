console.log('Tat Tap app loaded')

// Theme management
const themeToggle = document.getElementById('themeToggle')
const htmlElement = document.documentElement

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light'
const score = {
    ballsGathered: 0,
    ballsMissed: 0
}
let gameStarted = false
let balls = [] // Track all active balls with their timeouts
// Apply saved theme on load
if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark')
    themeToggle.textContent = '☀️'
    themeToggle.title = 'Set light theme'
} else {
    themeToggle.textContent = '🌙'
    themeToggle.title = 'Set dark theme'
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme')

    if (theme === 'dark') {
        htmlElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
        themeToggle.textContent = '🌙'
        themeToggle.title = 'Set light theme'
    } else {
        htmlElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
        themeToggle.textContent = '☀️'
        themeToggle.title = 'Set dark theme'
    }
})

const startTTL = 3000 // Initial TTL in ms

function addBall(x, y, timed = true) {
    console.log(`Add ball at (${x}, ${y})`)
    const container = document.getElementById('gameContainer')

    // Calculate TTL: start at 3000ms, reduce by 100ms every 10 balls, minimum 0ms
    const ttl = Math.max(0, startTTL - Math.floor(score.ballsGathered / 10) * 100)

    // Create ball element
    const ballElement = document.createElement('div')
    ballElement.className = 'ball'
    ballElement.style.left = `${x - 20}px`
    ballElement.style.top = `${y - 20}px`

    // Add random jiggle animation
    const jiggleNum = Math.floor(Math.random() * 4) + 1
    const jiggleDuration = 0.3 + Math.random() * 0.4 // Random duration between 0.3s and 0.7s
    const jiggleAnimation = `jiggle${jiggleNum} ${jiggleDuration}s ease-in-out infinite`

    // Add fade animation if timed and TTL > 0
    if (timed && ttl > 0) {
        ballElement.style.animation = `${jiggleAnimation}, fadeOut ${ttl}ms linear forwards`
    } else {
        ballElement.style.animation = jiggleAnimation
    }

    // Create ball object
    const ball = {
        x: x,
        y: y,
        radius: 20,
        element: ballElement,
        timeout: null
    }

    // Add click handler
    ballElement.addEventListener('click', () => handleBallClick(ball))

    // Add to DOM
    container.appendChild(ballElement)

    // Set up timed removal if this is a timed ball and TTL > 0
    if (timed && ttl > 0) {
        ball.timeout = setTimeout(() => {
            // Remove ball from array
            const index = balls.indexOf(ball)
            if (index > -1) {
                balls.splice(index, 1)
            }
            // Remove element from DOM
            if (ballElement.parentNode) {
                ballElement.remove()
            }
            score.ballsMissed += 1
            console.log(`Balls missed: ${score.ballsMissed}`)
            updateStatsDisplay()

            // Check if no balls remain - game over
            if (balls.length === 0) {
                gameOver()
            }
        }, ttl)
    }

    balls.push(ball)
    return ball
}

function removeBall(ball) {
    // Clear timeout if exists
    if (ball.timeout) {
        clearTimeout(ball.timeout)
    }

    // Remove from array
    const index = balls.indexOf(ball)
    if (index > -1) {
        balls.splice(index, 1)
    }

    // Remove element from DOM
    if (ball.element && ball.element.parentNode) {
        ball.element.remove()
    }
}

function handleBallClick(ball) {
    console.log(`Ball clicked at (${ball.x}, ${ball.y})`)

    // Remove the clicked ball
    removeBall(ball)

    // Increment score
    score.ballsGathered += 1
    console.log(`Balls gathered: ${score.ballsGathered}`)

    // Start game if this was the first ball
    if (!gameStarted) {
        gameStarted = true
        console.log('Game started!')
    }

    // Update score display
    updateStatsDisplay()

    // Check if TTL has reached 0
    const currentTTL = Math.max(0, startTTL - Math.floor(score.ballsGathered / 10) * 100)

    if (currentTTL === 0) {
        gameOver()
        return
    }

    // Add two new balls at random positions
    const container = document.getElementById('gameContainer')
    const maxX = container.clientWidth
    const maxY = container.clientHeight

    addBall(Math.random() * (maxX - 40) + 20, Math.random() * (maxY - 40) + 20)
    addBall(Math.random() * (maxX - 40) + 20, Math.random() * (maxY - 40) + 20)
}

function gameOver() {
    console.log('Round Over!')
    console.log(`Score - Balls Gathered: ${score.ballsGathered}, Balls Missed: ${score.ballsMissed}`)

    // Clear all remaining balls and timeouts
    balls.forEach(ball => {
        if (ball.timeout) {
            clearTimeout(ball.timeout)
        }
        if (ball.element && ball.element.parentNode) {
            ball.element.remove()
        }
    })
    balls = []

    // Reset game started flag
    gameStarted = false

    // Update high score if needed
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')
    if (score.ballsGathered > bestScore) {
        localStorage.setItem('bestScore', score.ballsGathered.toString())
        updateStatsDisplay()
    }

    // Show game over modal
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)
    document.getElementById('modalCaptured').textContent = score.ballsGathered
    document.getElementById('modalTimeout').textContent = `${currentTTL}s`
    document.getElementById('gameOverModal').classList.add('show')
}

function updateStatsDisplay() {
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')

    document.getElementById('capturedScore').textContent = score.ballsGathered
    document.getElementById('timeoutValue').textContent = `${currentTTL}s`
    document.getElementById('bestScore').textContent = bestScore
}

function restartGame() {
    // Hide modal
    document.getElementById('gameOverModal').classList.remove('show')

    // Reset game state
    score.ballsGathered = 0
    score.ballsMissed = 0
    gameStarted = false
    balls = []

    // Clear game container
    const container = document.getElementById('gameContainer')
    container.innerHTML = ''

    // Display stats and add starting ball
    updateStatsDisplay()
    const maxX = container.clientWidth
    const maxY = container.clientHeight
    addBall(maxX / 2, maxY / 2, false)
}

function initGame() {
    // Display initial stats and add starting ball
    updateStatsDisplay()

    const container = document.getElementById('gameContainer')
    const maxX = container.clientWidth
    const maxY = container.clientHeight
    addBall(maxX / 2, maxY / 2, false)

    // Set up play again button
    document.getElementById('playAgainBtn').addEventListener('click', restartGame)
}

window.onload = initGame