const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('../assets/audio.mp3')
const size = 30

// Posição inicial da cobrinha
const initialPosition = { x: 270, y: 240 }
let snake = [initialPosition]

// Soma dos pontos
const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

// Número aleatório
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

// Posição aleatória
const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round (number / 30) * 30
}

// Cor da comida aleatória
const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

// Desenho da comida
const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = "white"
    ctx.shadowBlur = 30
    ctx.fillStyle = color
    ctx.fillRect( x, y, size, size)
    ctx.shadowBlur = 0
}

// Desenho da cobrinha
const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position, index) => {
        if(index == snake.length -1) {
            ctx.fillStyle = "#fff"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

// Movimentação da cobrinha
const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length -1]

    if(direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if(direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if(direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if(direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }

    snake.shift()
}

// Linhas da tela
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#202020"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

// Quando a cobrinha comer a comida
const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()
        
        let x = randomPosition()
        let y = randomPosition()

        // Evitando que a comida nasça perto da cobrinha
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor
    }
}

// Gameover de colisões
const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(4px)"
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600) // Movendo a cobrinha (desenhando e apagando os anteriores)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}
gameLoop()

// Direções das teclas
document.addEventListener("keydown", ({ key }) => {
    if(key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if(key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if(key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

// Evento de click do botão
buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})