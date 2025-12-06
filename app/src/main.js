console.log('Tat Tap app loaded')
import './style.css'

// Theme management
const themeToggle = document.getElementById('themeToggle')
const htmlElement = document.documentElement

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light'
// const emojiMode = { enabled: localStorage.getItem('emojiMode') === 'true' }
const emojiMode = { enabled: true }
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '🛹', '🛼', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩']
const score = {
    ballsGathered: 0,
    mistaps: 0
}
let gameStarted = false
let balls = [] // Track all active balls with their timeouts
// Apply saved theme on load
if (currentTheme === 'dark') {
    htmlElement.setAttribute('data-theme', 'dark')
    themeToggle.textContent = '☀️'
    themeToggle.title = 'Switch to light theme'
} else {
    themeToggle.textContent = '🌙'
    themeToggle.title = 'Switch to dark theme'
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme')

    if (theme === 'dark') {
        htmlElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'light')
        themeToggle.textContent = '🌙'
        themeToggle.title = 'Switch to dark theme'
    } else {
        htmlElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
        themeToggle.textContent = '☀️'
        themeToggle.title = 'Switch to light theme'
    }
})


// Audio and mute toggle
const bgMusic = document.getElementById('bgMusic')
const muteToggle = document.getElementById('muteToggle')
const audioState = { muted: true }

if (audioState.muted) {
    muteToggle.textContent = '🔇'
    muteToggle.title = 'Unmute sound'
    bgMusic.muted = true
} else {
    muteToggle.textContent = '🔊'
    muteToggle.title = 'Mute sound'
    bgMusic.muted = false
}

muteToggle.addEventListener('click', () => {
    audioState.muted = !audioState.muted
    bgMusic.muted = audioState.muted
    if (audioState.muted) {
        muteToggle.textContent = '🔇'
        muteToggle.title = 'Unmute sound'
        bgMusic.pause()
        //hide the next track button when muted
        nextTrackBtn.style.display = 'none'
    } else {
        muteToggle.textContent = '🔊'
        muteToggle.title = 'Mute sound'
        // Set audio source only when starting to play
        if (!bgMusic.src) {
            bgMusic.src = tracks[currentTrackIndex]
        }
        bgMusic.play().catch(err => console.log('Audio play failed:', err))
        //show the next track button when unmuted
        nextTrackBtn.style.display = 'inline-block'
        // the number of the current track on the button
        nextTrackBtn.textContent = `⏭️ ${emojiNumbers[currentTrackIndex + 1]}`
    }
})

// Start music on first interaction
let musicStarted = false
const startMusic = () => {
    if (!musicStarted && !audioState.muted) {
        // Set audio source only when starting to play
        if (!bgMusic.src) {
            bgMusic.src = tracks[currentTrackIndex]
        }
        bgMusic.play().catch(err => console.log('Audio play failed:', err))
        musicStarted = true
    }
}

// Add event listener to start music on first click
document.addEventListener('click', startMusic, { once: true })

const tracks = [
    'https://music-bucket.nad27.net/radiox/backToWork.mp3',
    'https://music-bucket.nad27.net/radiox/duke.wav',
    'https://music-bucket.nad27.net/radiox/AfterWork.wav',
    'https://music-bucket.nad27.net/radiox/Freshies.wav',
]

const emojiNumbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

// Load current track from localStorage or default to 0
let currentTrackIndex = parseInt(localStorage.getItem('currentTrackIndex') || '0')

const nextTrackBtn = document.getElementById('nextTrackBtn')

// Set initial button text to show current track
nextTrackBtn.textContent = `⏭️ ${emojiNumbers[currentTrackIndex + 1]}`

nextTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length
    bgMusic.src = tracks[currentTrackIndex]
    if (!audioState.muted) {
        bgMusic.play().catch(err => console.log('Audio play failed:', err))
    }
    // Update button text to show current track number as emoji
    nextTrackBtn.textContent = `⏭️ ${emojiNumbers[currentTrackIndex + 1]}`
    //store current track index in localStorage
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString())
})


const startTTL = 3000 // Initial TTL in ms
const END_GAME_STATEMENTS = [
    'Game Over!',
    'Keep trying!',
    'You can do it!',
    'Great job!',
    'Nice work!',
    'Well done!',
    'Fantastic!',
    'Amazing!',
    'Incredible!',
    'Outstanding!',
    'Spectacular!',
    'Brilliant!',
    'Superb!',
    'Excellent!',
    'Awesome!',
]

function getRadomEndGameStatement() {
    return END_GAME_STATEMENTS[Math.floor(Math.random() * END_GAME_STATEMENTS.length)]
}

function calculateAccuracy() {
    const totalTaps = score.ballsGathered + score.mistaps
    // Only show 100% accuracy if they've collected at least 2 balls (started the game)
    if (totalTaps === 0 || score.ballsGathered < 2) return 0
    return ((score.ballsGathered / totalTaps) * 100).toFixed(1)
}



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

    // Use emoji mode or regular ball
    if (emojiMode.enabled) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
        ballElement.textContent = randomEmoji
        ballElement.style.background = 'transparent'
        ballElement.style.fontSize = '32px'
        ballElement.style.display = 'flex'
        ballElement.style.alignItems = 'center'
        ballElement.style.justifyContent = 'center'
        ballElement.style.boxShadow = 'none'
    }

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

    const currentAccuracy = parseFloat(calculateAccuracy())

    // Update high score if needed
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')
    if (score.ballsGathered > bestScore) {
        localStorage.setItem('bestScore', score.ballsGathered.toString())
        localStorage.setItem('bestAccuracy', currentAccuracy.toString())
        updateStatsDisplay()
    }
    // If same score but better accuracy, update accuracy
    else if (score.ballsGathered === bestScore) {
        const bestAccuracy = parseFloat(localStorage.getItem('bestAccuracy') || '0')
        if (currentAccuracy > bestAccuracy) {
            localStorage.setItem('bestAccuracy', currentAccuracy.toString())
            updateStatsDisplay()
        }
    }

    // Show game over modal
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)
    document.getElementById('modalCaptured').textContent = score.ballsGathered
    document.getElementById('modalAccuracy').textContent = `${currentAccuracy}%`
    document.getElementById('modalTimeout').textContent = `${currentTTL}s`
    document.getElementById('gameOverHeader').textContent = getRadomEndGameStatement()
    document.getElementById('gameOverEmojis').textContent = Array.from({ length: Math.min(5, Math.floor(score.ballsGathered / 50)) }, () => emojis[Math.floor(Math.random() * emojis.length)]).join(' ')
    document.getElementById('gameOverModal').classList.add('show')
}

function updateStatsDisplay() {
    const currentTTL = Math.max(0, (startTTL - Math.floor(score.ballsGathered / 10) * 100) / 1000)
    const bestScore = parseInt(localStorage.getItem('bestScore') || '0')
    const bestAccuracy = parseFloat(localStorage.getItem('bestAccuracy') || '0')
    const currentAccuracy = calculateAccuracy()

    document.getElementById('capturedScore').textContent = score.ballsGathered
    document.getElementById('accuracyScore').textContent = `${currentAccuracy}%`
    document.getElementById('timeoutValue').textContent = `${currentTTL}s`
    document.getElementById('bestScore').textContent = bestScore
    document.getElementById('bestAccuracy').textContent = `${bestAccuracy}%`
}

function restartGame() {
    // Hide modal
    document.getElementById('gameOverModal').classList.remove('show')
    // Reset game state
    score.ballsGathered = 0
    score.mistaps = 0
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
    const accuracy = calculateAccuracy()

    // Create share text with yellow ball emojis based on milestones

    // choose a random emoji for each ball if emoji mode is enabled
    const ballEmojis = Array.from({ length: Math.min(5, Math.floor(captured / 50)) }, () => emojis[Math.floor(Math.random() * emojis.length)]).join(' ')
    const separation = ballEmojis.length > 0 ? '\n\n' : ''
    const shareText = `${ballEmojis}${separation}Tap Tap Score:\nCAPTURED: ${captured}\nHIT RATE: ${accuracy}%\nTIMEOUT: ${currentTTL}s\n\n Can you beat my score?\nhttps://taptap.nad27.net/`

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

function createMissIndicator(x, y) {
    const container = document.getElementById('gameContainer')
    const missIndicator = document.createElement('div')
    missIndicator.className = 'miss-indicator'
    missIndicator.textContent = '❌'
    missIndicator.style.left = `${x}px`
    missIndicator.style.top = `${y}px`
    missIndicator.style.transform = 'translate(-50%, -50%)'

    container.appendChild(missIndicator)

    // Increment mistaps counter
    score.mistaps += 1
    updateStatsDisplay()

    // Remove miss indicator after it fades (500ms)
    setTimeout(() => {
        if (missIndicator.parentNode) {
            missIndicator.remove()
        }
    }, 500)
}

function initGame() {
    // Display initial stats and add starting ball
    updateStatsDisplay()

    const container = document.getElementById('gameContainer')
    const maxX = container.clientWidth
    const maxY = container.clientHeight
    addBall(maxX / 2, maxY / 2, false)

    // Add click handler to container for missed clicks
    container.addEventListener('click', (e) => {
        // Check if click was on the container itself (not a ball)
        if (e.target === container) {
            createMissIndicator(e.clientX, e.clientY)
        }
    })

    // Set up buttons
    document.getElementById('playAgainBtn').addEventListener('click', restartGame)
    document.getElementById('shareBtn').addEventListener('click', shareResults)
}

window.onload = initGame