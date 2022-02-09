/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
const paperCountDisplay = document.querySelector(".paper-count")
const resetButton = document.querySelector(".reset-button")
const playButton = document.querySelector(".play-button")

//clears gameloop interval, rendering game over.  also clears canvas to blank state.
//currently functions like a pause button.  screen gets cleared but all rendered objects still have their positions set.
resetButton.addEventListener("click", () => {
    clearInterval(gameLoopInterval)
    resetGameState()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    gameRunning = false
    //reset all game-state values in here
})
playButton.addEventListener("click", () => {
    if ((gameRunning === false)) {
        makeHouses(5)
        makeNewspapers(5)
        gameLoopInterval = setInterval(gameLoop, 60) //game speed set by interval
        gameRunning = true
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

// currently turning gameloopinterval on and off with the "play game" and "end game" buttons. end game clears screen but pauses object statuses.
let gameLoopInterval
let paperPlaceInterval

/* GAME FUNCTIONS */

//houses all have a standard size.  we only pass in location of the house.
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
//for the paperperson
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
//for the thrown newspapers
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

let powerup1 = new Powerup(getRandomInBoundsXValue(), getRandomInBoundsYValue())
let powerup2 = new Powerup(200, 200)
let powerup3 = new Powerup(250, 200)
let powerupArray = [powerup1, powerup2, powerup3]
let placedPowerups = []

let newPlayer = new Deliverer(300, 300)

let bonusPaper = new Newspaper(newPlayer.x, newPlayer.y)

let paperArray = []
let neighborhood = []
let neighborhoodLeft = []
let neighborhoodRight = [
    
]
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

//maybe create set amount of houses in a function. push them into the correct arrays
function makeHouses(n) {
    let houses = new Array(n)
    let yLoc = 5
    //generates houses on left side of level
    for (let i = 0; i < n; i++) {
        houses[i] = new House(5,yLoc)
        houses[i+n] = new House(600,yLoc)
        neighborhood.push(houses[i])
        neighborhoodLeft.push(houses[i])
        neighborhood.push(houses[i+n])
        neighborhoodRight.push(houses[i+n])
        yLoc += 100
    }
}

function makeNewspapers(n){
    let newspapers = new Array(n)
    for(let i = 0; i < n; i++){
        newspapers[i] = new Newspaper()
        paperArray.push(newspapers[i])
    }
}

//checks key press inputs for 4 movement directions
//need to add a way to keep user within certain boundaries
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
//randomly selects if a house is a subscriber or not when being replaced
function subscriberRandomizer() {
    const rand = Math.floor(Math.random() * 2)
    return rand === 1
}

function detectPaperDelivery() {
    //check if a papers left side crossed into the "left boundary"
    thrownPapersLeft.forEach((paper) => {
        //left side value hard coded in as no houses will be placed beyond 55px mark for now
        if (paper.x < 55) {
            //check if it hit the correct Y value of the each house as well
            neighborhoodLeft.forEach((house) => {
                if (
                    paper.y < house.y + house.height &&
                    paper.y > house.y &&
                    !house.isDelivered
                ) {
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
    //check if paper crossed into the "right boundary"
    thrownPapersRight.forEach((paper) => {
        //right side value hard coded in as houses will only be placed on the 600px mark for now
        if (paper.x + paper.width > 600) {
            neighborhoodRight.forEach((house) => {
                //check if it hit corrects y value of house
                if (
                    paper.y < house.y + house.height &&
                    paper.y > house.y &&
                    !house.isDelivered
                ) {
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

//checks to see if all newspaper arrays are empty (out of paper) - no more ways to get points
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

//currently resets all gamestate variables back to "initial" value.
function resetGameState() {
    userScore = 0

    powerup1 = new Powerup(getRandomInBoundsXValue(), getRandomInBoundsYValue())
    powerup2 = new Powerup(200, 200)
    powerup3 = new Powerup(250, 200)
    powerupArray = [powerup1, powerup2, powerup3]
    placedPowerups = []

    newPlayer = new Deliverer(300, 300)

    paperArray = []
    neighborhood = []
    neighborhoodLeft = []
    neighborhoodRight = []
    thrownPapersRight = []
    thrownPapersLeft = []
}

function collectNewspaperCheck() {
    placedPowerups.forEach((power) => {
        if (
            newPlayer.x <
                power.x +
                    power.height /* check player left vs powerup right*/ &&
            newPlayer.x + newPlayer.width >
                power.x /* check player right vs powerup left */ &&
            newPlayer.y <
                power.y +
                    power.height /* check player top vs powerup bottom */ &&
            newPlayer.y + newPlayer.height >
                power.y /* check player bottom vs powerup top */
        ) {
            console.log("hit bonus newspaper")
            paperArray.push(bonusPaper)
            //temporary code to make powerup go away
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

//places newspapers randomly on level.  would love to have them show up after "x" happens rather than all populate at once.
function placeExtraNewspapers() {
    if (powerupArray.length != 0) {
        powerupArray[0].x = getRandomInBoundsXValue()
        powerupArray[0].y = getRandomInBoundsYValue()
        placedPowerups.push(powerupArray[0])
        powerupArray.shift()
    }
    for (let i = 0; i < placedPowerups.length; i++) {
        placedPowerups[i].render()
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    updatePaperCountDisplay()
    paperThrowHandler()
    // placeExtraNewspapers()
    houseMover()
    // collectNewspaperCheck()
    delivererMover()
    gameOverCheck()
}
