/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
const paperCountDisplay = document.querySelector(".paper-count")
const resetButton = document.querySelector(".reset-button")
const playButton = document.querySelector(".play-button")

resetButton.addEventListener("click", () => {
    clearInterval(gameLoopInterval)
    resetGameState()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

playButton.addEventListener("click", () => {
    if (gameRunning === false) {
        makeHouses(5)
        makeNewspapers(5)
        makePowerupNewspapers(5)
        gameLoopInterval = setInterval(gameLoop, 60)
    }
})

//tracking keypresses inside object with boolean values.
let pressedKeys = {}
document.addEventListener("keydown", (e) => (pressedKeys[e.key] = true))
document.addEventListener("keyup", (e) => (pressedKeys[e.key] = false))

/* GAME STATE */
const ctx = canvas.getContext("2d")
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
let userScore = 0
let gameRunning = false
let gameLoopInterval
let paperPlaceInterval

/* GAME FUNCTIONS */

class House {
    constructor(xLoc, yLoc) {
        ;(this.x = xLoc), (this.y = yLoc), (this.width = 50), (this.height = 80)
        this.isSubscriber = subscriberRandomizer()
        this.isDelivered = false
    }
    render() {
        if (this.isSubscriber) {
            ctx.strokeStyle = "green"
        } else {
            ctx.strokeStyle = "red"
        }
        if (this.isDelivered) {
            ctx.strokeStyle = "yellow"
        }
        ctx.fillStyle = "salmon"
        ctx.lineWidth = 3
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    //change the y axis of the house, simulating movement.
    slide() {
        this.y += 2
    }
}

class Deliverer {
    constructor(xLoc, yLoc) {
        ;(this.x = xLoc),
            (this.y = yLoc),
            (this.width = 4),
            (this.height = 15),
            (this.hasPowerup = false)
    }
    render() {
        if (this.hasPowerup) {
        }
        ctx.fillStyle = "green"
        ctx.lineWidth = 2
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

class Newspaper {
    constructor() {
        this.x = 0 /* x and y values get reassigned as soon as paper becomes thrown */
        this.y = 0
        this.width = 3
        this.height = 3
    }
    render() {
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    //the paper flies 2px right and 1px down per cycle - staying in line with the houses but heading towards them - left and right
    flyRight() {
        this.x += 5
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
    flyLeft() {
        this.x -= 5
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
}

class Powerup {
    constructor(newX, newY) {
        this.x = newX
        this.y = newY
        this.width = 5
        this.height = 5
    }
    render() {
        ctx.fillStyle = "white"
        ctx.lineWidth = 1
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let powerupArray = []
let testPowerup = new Powerup(200,200)
let placedPowerups = [testPowerup]
let newPlayer = new Deliverer(300, 300)
let paperArray = []
let neighborhood = []
let neighborhoodLeft = []
let neighborhoodRight = []
let thrownPapersRight = []
let thrownPapersLeft = []

//check for when a house 'slides off' the screen, remove it from neighborhood and add it back to the top - "endless" functionality
function houseMover() {
    neighborhood.forEach((house) => {
        house.render()
        house.slide()
        if (house.y > 450) {
            house.y = -120
            house.isDelivered = false
        }
    })
}

function makeHouses(n) {
    let houses = new Array(n)
    let yLoc = 5
    //generates houses on left side of level
    for (let i = 0; i < n; i++) {
        houses[i] = new House(5, yLoc)
        houses[i + n] = new House(600, yLoc)
        neighborhood.push(houses[i])
        neighborhoodLeft.push(houses[i])
        neighborhood.push(houses[i + n])
        neighborhoodRight.push(houses[i + n])
        yLoc += 100
    }
}

function makeNewspapers(n) {
    let newspapers = new Array(n)
    for (let i = 0; i < n; i++) {
        newspapers[i] = new Newspaper()
        paperArray.push(newspapers[i])
    }
}

function makePowerupNewspapers(n){
    let powerups = new Array(n)
    for(let i = 0; i < n; i++){
        powerups[i] = new Powerup(getRandomInBoundsXValue(),getRandomInBoundsYValue())
        powerupArray.push(powerups[i])
    }
}

function delivererMover() {
    if (newPlayer.x < 600) {
        if (pressedKeys.d) {
            newPlayer.x += 2
        }
    }
    if (newPlayer.x > 100) {
        if (pressedKeys.a) {
            newPlayer.x -= 2
        }
    }
    if (newPlayer.y > 50) {
        if (pressedKeys.w) {
            newPlayer.y -= 2
        }
    }
    if (newPlayer.y < 350) {
        if (pressedKeys.s) {
            newPlayer.y += 2
        }
    }
    newPlayer.render()
}

function subscriberRandomizer() {
    const rand = Math.floor(Math.random() * 2)
    return rand === 1
}

function detectPaperDelivery() {
    thrownPapersLeft.forEach((paper) => {
        if (paper.x < 55) {
            neighborhoodLeft.forEach((house) => {
                if(collisionDetect(paper,house))
                {
                    if (house.isSubscriber) {
                        userScore += 1000
                    } else if (!house.isSubscriber) {
                        userScore -= 500
                    }
                    house.isDelivered = true
                }
            })
            thrownPapersLeft.shift()
        }
    })
    thrownPapersRight.forEach((paper) => {
        if (paper.x + paper.width > 600) {
            neighborhoodRight.forEach((house) => {
                if (collisionDetect(paper,house)) {
                    if (house.isSubscriber) {
                        userScore += 1000
                    } else if (!house.isSubscriber) {
                        userScore -= 500
                    }
                    house.isDelivered = true
                }
            })
            thrownPapersRight.shift()
        }
    })
}

//might be a better dry way to check object collision?
function collisionDetect(obj1,obj2){
    if(obj1.x < obj2.x + obj2.height &&
       obj1.x + obj1.width > obj2.x &&
       obj1.y < obj2.y + obj2.height &&
       obj1.y + obj1.height > obj2.y ){
           console.log("collision detected")
           return true
       }
}

function paperThrowHandler() {
    //when key is pressed - remove paper from paperArray and add to new thrownPapers array
    if (paperArray.length != 0) {
        if (pressedKeys.q) {
            //set paper location to users current location
            paperArray[0].x = newPlayer.x
            paperArray[0].y = newPlayer.y
            //move into separate array depending on direction its thrown
            thrownPapersLeft.push(paperArray[0])
            paperArray.shift()
        }
        if (pressedKeys.e) {
            //set paper location to users current location
            paperArray[0].x = newPlayer.x
            paperArray[0].y = newPlayer.y
            //move into separate array depending on direction its thrown
            thrownPapersRight.push(paperArray[0])
            paperArray.shift()
        }
    }
    //render and move all papers that have been thrown
    for (let i = 0; i < thrownPapersLeft.length; i++) {
        thrownPapersLeft[i].render()
        thrownPapersLeft[i].flyLeft()
    }
    for (let i = 0; i < thrownPapersRight.length; i++) {
        thrownPapersRight[i].render()
        thrownPapersRight[i].flyRight()
    }
    detectPaperDelivery()
}

function gameOverCheck() {
    if (
        paperArray.length === 0 &&
        thrownPapersLeft.length === 0 &&
        thrownPapersRight.length === 0
    ) {
        scoreBoard.innerText = `Game Over - Total score ${userScore}`
        clearInterval(gameLoopInterval)
    }
}

function updatePaperCountDisplay() {
    const sentence =
        paperArray.length > 0
            ? `${paperArray.length} papers left`
            : "no papers left!"
    paperCountDisplay.innerText = sentence
}

function resetGameState() {
    userScore = 0

    placedPowerups = []
    powerupArray = []
    newPlayer = new Deliverer(300, 300)
    paperArray = []
    neighborhood = []
    neighborhoodLeft = []
    neighborhoodRight = []
    thrownPapersRight = []
    thrownPapersLeft = []
    gameRunning = false
}

function collectNewspaperCheck() {
    placedPowerups.forEach((power) => {
        power.render()
        if(collisionDetect(newPlayer,power)){
            power.x = -100
            power.y = -100
        }
    })
}

function getRandomInBoundsXValue() {
    return Math.floor(Math.random() * (600 - 100 + 1) + 100)
}

function getRandomInBoundsYValue() {
    return Math.floor(Math.random() * (350 - 50 + 1) + 50)
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    updatePaperCountDisplay()
    paperThrowHandler()
    houseMover()
    collectNewspaperCheck()
    delivererMover()
    gameOverCheck()
    gameRunning = true
}
