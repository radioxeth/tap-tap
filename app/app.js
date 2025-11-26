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

function createRipple(x, y) {
    const rippleContainer = document.getElementById('rippleContainer')
    const ripple = document.createElement('div')
    ripple.className = 'ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.transform = 'translate(-50%, -50%)'

    rippleContainer.appendChild(ripple)

    // Remove ripple after it fades (500ms)
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove()
        }
    }, 500)
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
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)
    console.log(`Ball clicked at (${ball.x}, ${ball.y})`)

    // Shrink ball animation
    ball.element.style.animation = 'shrinkBall 250ms ease-in forwards'

    // After shrink completes, create ripples and continue game logic
    setTimeout(() => {
        // Create ripples at ball position every 500ms for 1 second (2 ripples total)
        const rippleInterval = 500 // 0.5 seconds
        const rippleDuration = 500 // 1 second total
        const rippleCount = Math.ceil(rippleDuration / rippleInterval)

        // Create initial ripple
        createRipple(ball.x, ball.y)

        // Create subsequent ripples (new ring every 500ms)
        for (let i = 1; i < rippleCount; i++) {
            setTimeout(() => {
                createRipple(ball.x, ball.y)
            }, i * rippleInterval)
        }

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
    }, 250)
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

    // Clear game container and ripples
    const container = document.getElementById('gameContainer')
    container.innerHTML = ''
    const rippleContainer = document.getElementById('rippleContainer')
    rippleContainer.innerHTML = ''

    // Display stats and add starting ball
    updateStatsDisplay()
    const maxX = container.clientWidth
    const maxY = container.clientHeight
    addBall(maxX / 2, maxY / 2, false)
}

function shareResults() {
    const captured = score.ballsGathered
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)

    // Create share text with yellow ball emojis based on milestones
    let ballCount = 0
    if (captured >= 150) ballCount = 4
    else if (captured >= 100) ballCount = 3
    else if (captured >= 50) ballCount = 2
    else if (captured >= 25) ballCount = 1

    const ballEmojis = '🟡'.repeat(ballCount)
    const shareText = `${ballEmojis}\n\nTap Tap Score\nCAPTURED: ${captured}\nTIMEOUT: ${currentTTL}s\n\nhttps://taptap.nad27.net/`

    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
        // Provide feedback
        const shareBtn = document.getElementById('shareBtn')
        const originalText = shareBtn.textContent
        shareBtn.textContent = 'Copied!'
        setTimeout(() => {
            shareBtn.textContent = originalText
        }, 2000)
    }).catch(err => {
        console.error('Failed to copy:', err)
        alert('Failed to copy to clipboard')
    })
}

function initGame() {
    // Display initial stats and add starting ball
    updateStatsDisplay()

    const container = document.getElementById('gameContainer')
    const maxX = container.clientWidth
    const maxY = container.clientHeight
    addBall(maxX / 2, maxY / 2, false)

    // Set up buttons
    document.getElementById('playAgainBtn').addEventListener('click', restartGame)
    document.getElementById('shareBtn').addEventListener('click', shareResults)
}

window.onload = initGame