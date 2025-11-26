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

function addBall(x, y, timed = true) {
    console.log(`Add ball at (${x}, ${y})`)
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // Calculate TTL: start at 2000ms, reduce by 100ms every 10 balls, minimum 0ms
    const ttl = Math.max(0, 2000 - Math.floor(score.ballsGathered / 10) * 100)

    // Create ball object
    const ball = {
        x: x,
        y: y,
        radius: 20,
        timeout: null
    }

    // Draw the ball
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20)
    gradient.addColorStop(0, '#FFD700')
    gradient.addColorStop(1, '#FFA500')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Set up timed removal if this is a timed ball and TTL > 0
    if (timed && ttl > 0) {
        ball.timeout = setTimeout(() => {
            // Remove ball from array
            const index = balls.indexOf(ball)
            if (index > -1) {
                balls.splice(index, 1)
            }
            // Clear the ball from canvas
            ctx.clearRect(x - 21, y - 21, 42, 42)
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
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    // Clear timeout if exists
    if (ball.timeout) {
        clearTimeout(ball.timeout)
    }

    // Remove from array
    const index = balls.indexOf(ball)
    if (index > -1) {
        balls.splice(index, 1)
    }

    // Clear from canvas
    ctx.clearRect(ball.x - 21, ball.y - 21, 42, 42)
}

function findBallAtPosition(x, y) {
    // Find if click is within any ball's radius
    return balls.find(ball => {
        const dx = x - ball.x
        const dy = y - ball.y
        return Math.sqrt(dx * dx + dy * dy) <= ball.radius
    })
}

function handleCanvasClick(event) {
    const canvas = document.getElementById('canvas')
    const rect = canvas.getBoundingClientRect()

    // Account for canvas scaling - convert from display coordinates to canvas coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    console.log(`Click at (${x}, ${y})`)
    console.log(`Balls:`, balls)

    const clickedBall = findBallAtPosition(x, y)
    console.log(`Clicked ball:`, clickedBall)

    if (clickedBall) {
        // Remove the clicked ball
        removeBall(clickedBall)

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
        const currentTTL = Math.max(0, 2000 - Math.floor(score.ballsGathered / 10) * 100)

        if (currentTTL === 0) {
            gameOver()
            return
        }

        // Add two new balls at random positions
        addBall(Math.random() * canvas.width, Math.random() * canvas.height)
        addBall(Math.random() * canvas.width, Math.random() * canvas.height)
    }
}

function gameOver() {
    console.log('Round Over!')
    console.log(`Score - Balls Gathered: ${score.ballsGathered}, Balls Missed: ${score.ballsMissed}`)

    // Clear all remaining balls and timeouts
    balls.forEach(ball => {
        if (ball.timeout) {
            clearTimeout(ball.timeout)
        }
    })
    balls = []

    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Reset game started flag
    gameStarted = false

    // Update high score if needed
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')
    if (score.ballsGathered > bestScore) {
        localStorage.setItem('bestScore', score.ballsGathered.toString())
        updateStatsDisplay()
    }

    // Show game over modal
    const currentTTL = Math.max(0, 2000 - Math.floor(score.ballsGathered / 10) * 100)
    document.getElementById('modalCaptured').textContent = score.ballsGathered
    document.getElementById('modalMissed').textContent = score.ballsMissed
    document.getElementById('modalTimeout').textContent = `${currentTTL}ms`
    document.getElementById('gameOverModal').classList.add('show')
}

function updateStatsDisplay() {
    const currentTTL = Math.max(0, 2000 - Math.floor(score.ballsGathered / 10) * 100)
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')

    document.getElementById('capturedScore').textContent = score.ballsGathered
    document.getElementById('missedScore').textContent = score.ballsMissed
    document.getElementById('timeoutValue').textContent = `${currentTTL}ms`
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

    // Clear and reinitialize canvas
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Display stats and add starting ball
    updateStatsDisplay()
    addBall(canvas.width / 2, canvas.height / 2, false)

    // Set up click handler for gameplay
    canvas.onclick = handleCanvasClick
}

function initCanvas() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    function resizeCanvas() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        // Redraw all balls after resize
        balls.forEach(ball => {
            const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, 20)
            gradient.addColorStop(0, '#FFD700')
            gradient.addColorStop(1, '#FFA500')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(ball.x, ball.y, 20, 0, Math.PI * 2)
            ctx.fill()
        })
    }
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    // Display initial stats and add starting ball
    updateStatsDisplay()
    addBall(canvas.width / 2, canvas.height / 2, false)

    // Set up click handler
    canvas.onclick = handleCanvasClick

    // Set up play again button
    document.getElementById('playAgainBtn').addEventListener('click', restartGame)
}

window.onload = initCanvas