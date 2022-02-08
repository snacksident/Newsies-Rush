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
    //reset all game-state values in here
})
playButton.addEventListener("click", () => {
    gameLoopInterval = setInterval(gameLoop, 60) //game speed set by interval
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

// currently turning gameloopinterval on and off with the "play game" and "end game" buttons. end game clears screen but pauses object statuses.
let gameLoopInterval

/* GAME FUNCTIONS */

//houses all have a standard size.  we only pass in location of the house.
class House {
    constructor(xLoc, yLoc) {
        (this.x = xLoc), (this.y = yLoc), (this.width = 50), (this.height = 80)
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
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
    //change the y axis of the house, simulating movement.
    slide() {
        this.y += 2
    }
}
//for the paperperson
class Deliverer {
    constructor(xLoc, yLoc) {
        (this.x = xLoc), (this.y = yLoc), (this.width = 4), (this.height = 15), (this.hasPowerup = false)
    }
    render() {
        if(this.hasPowerup){

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
    constructor() {
        this.x = 100
        this.y = 100
        this.width = 5
        this.height = 5
    }
    render() {
        ctx.fillStyle = "white"
        ctx.lineWidth = 1
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let testPower = new Powerup()

let leftHouse = new House(5, 5)
let leftHouse2 = new House(5, 115)
let leftHouse3 = new House(5, 225)
let leftHouse4 = new House(5, 335)
let leftHouse5 = new House(5, 445)

let rightHouse = new House(600, 5)
let rightHouse2 = new House(600, 100)
let rightHouse3 = new House(600, 230)
let rightHouse4 = new House(600, 350)
let rightHouse5 = new House(600, 460)

let newPlayer = new Deliverer(300, 300)

let newPaper = new Newspaper(newPlayer.x, newPlayer.y)
let newPaper2 = new Newspaper(newPlayer.x, newPlayer.y)
let newPaper3 = new Newspaper(newPlayer.x, newPlayer.y)
let newPaper4 = new Newspaper(newPlayer.x, newPlayer.y)
let newPaper5 = new Newspaper(newPlayer.x, newPlayer.y)
let paperArray = [newPaper, newPaper2, newPaper3, newPaper4, newPaper5]
let neighborhood = [
    leftHouse,
    rightHouse,
    leftHouse2,
    rightHouse2,
    leftHouse3,
    rightHouse3,
    leftHouse4,
    rightHouse4,
    leftHouse5,
    rightHouse5,
]
let neighborhoodLeft = [
    leftHouse,
    leftHouse2,
    leftHouse3,
    leftHouse4,
    leftHouse5,
]
let neighborhoodRight = [
    rightHouse,
    rightHouse2,
    rightHouse3,
    rightHouse4,
    rightHouse5,
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

//checks key press inputs for 4 movement directions
//need to add a way to keep user within certain boundaries
function delivererMover() {
    if(newPlayer.x < 600){
        if (pressedKeys.d) {
            newPlayer.x += 2
        }
    }
    if (newPlayer.x > 100) {
        if (pressedKeys.a) {
            newPlayer.x -= 2
        }
    }
    if(newPlayer.y > 50){
        if (pressedKeys.w) {
            newPlayer.y -= 2
        }
    }
    if(newPlayer.y < 350){
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

/* kind of works, needs a re-visit */
/* currently will tell a paper it was delivered if the house slides into it from the top as well*/
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
    const sentence = paperArray.length > 0 ? `${paperArray.length} papers left` : "no papers left!"
    paperCountDisplay.innerText = sentence
}

//currently resets all gamestate variables back to "initial" value.
function resetGameState() {
    userScore = 0
    leftHouse = new House(5, 5)
    leftHouse2 = new House(5, 115)
    leftHouse3 = new House(5, 225)
    leftHouse4 = new House(5, 335)
    leftHouse5 = new House(5, 445)

    rightHouse = new House(600, 5)
    rightHouse2 = new House(600, 100)
    rightHouse3 = new House(600, 230)
    rightHouse4 = new House(600, 350)
    rightHouse5 = new House(600, 460)

    newPlayer = new Deliverer(300, 300)

    newPaper = new Newspaper(newPlayer.x, newPlayer.y)
    newPaper2 = new Newspaper(newPlayer.x, newPlayer.y)
    newPaper3 = new Newspaper(newPlayer.x, newPlayer.y)
    newPaper4 = new Newspaper(newPlayer.x, newPlayer.y)
    newPaper5 = new Newspaper(newPlayer.x, newPlayer.y)
    paperArray = [newPaper, newPaper2, newPaper3, newPaper4, newPaper5]
    neighborhood = [
        leftHouse,
        rightHouse,
        leftHouse2,
        rightHouse2,
        leftHouse3,
        rightHouse3,
        leftHouse4,
        rightHouse4,
        leftHouse5,
        rightHouse5,
    ]
    neighborhoodLeft = [
        leftHouse,
        leftHouse2,
        leftHouse3,
        leftHouse4,
        leftHouse5,
    ]
    neighborhoodRight = [
        rightHouse,
        rightHouse2,
        rightHouse3,
        rightHouse4,
        rightHouse5,
    ]
    thrownPapersRight = []
    thrownPapersLeft = []
}

function collectNewspaper() {
    //if user hits a newspaper on the ground, add to the newspaper array to make throwable
    
}

function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    updatePaperCountDisplay()
    paperThrowHandler()
    houseMover()
    delivererMover()
    gameOverCheck()
}
