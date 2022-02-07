/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
const resetButton = document.querySelector(".reset-button")
const playButton = document.querySelector(".play-button")
//clears gameloop interval, rendering game over.  also clears canvas to blank state.
resetButton.addEventListener('click',()=>{
    clearInterval(gameLoopInterval)
    ctx.clearRect(0,0, canvas.width, canvas.height)
})
playButton.addEventListener('click',()=>{
    gameLoopInterval = setInterval(gameLoop, 60) //game speed set by interval
})

let pressedKeys = {}

document.addEventListener('keydown', e => pressedKeys[e.key] = true)
document.addEventListener('keyup', e => pressedKeys[e.key] = false)


/* GAME STATE */
const ctx = canvas.getContext('2d')
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
let userScore = 0

// let gameLoopInterval = setInterval(gameLoop, 500) //game speed set by interval
// currently turning gameloopinterval on and off with the "play game" and "end game" buttons. end game clears screen but pauses object statuses.
let gameLoopInterval;
/* GAME FUNCTIONS */


//refactor to check left papers and right papers separately?
function detectPaperDelivery(){
    //check if a papers left side crossed into the "left boundary"
    thrownPapersLeft.forEach((paper)=>{
        if(paper.x < 55){
            console.log(`${paper} has crossed ${paper.x} x boundary`)
            thrownPapersLeft.shift()
        }
    })
    thrownPapersRight.forEach((paper)=>{
        if(paper.x + paper.width > 500){
            console.log(`${paper} has crossed ${paper.x} x boundary`)
            thrownPapersRight.shift()
        }
    })
}

//houses all have a standard size.  we only pass in location of the house.
class House {
    constructor(xLoc,yLoc){
        this.x = xLoc,
        this.y = yLoc,
        this.width = 50,
        this.height = 80
    }
    render(){
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 2
        ctx.strokeRect(this.x,this.y,this.width,this.height)
    }
    //change the y axis of the house, simulating movement.
    slide(){
        this.y++
    }
}
//for the paperperson
class Deliverer {
    constructor(xLoc, yLoc){
        this.x = xLoc,
        this.y = yLoc,
        this.width = 4,
        this.height = 15
    }
    render(){
        ctx.fillStyle = 'green'
        ctx.lineWidth = 2
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }
    throwPaper(){
        
    }
}
//for the thrown newspapers
class Newspaper {
    constructor(newX,newY){
        this.x = newX
        this.y = newY
        this.width = 3,
        this.height = 3
    }
    render(){
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.strokeRect(this.x,this.y,this.width,this.height)
    }
    //the paper flies 2px right and 1px down per cycle - staying in line with the houses but heading towards them - left and right
    flyRight(){
        this.x += 2
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
    flyLeft(){
        this.x -=2
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
}


let newHouse = new House(5,5)
let newHouse2 = new House(600,5)
let newPlayer = new Deliverer(300,300)
let newPaper = new Newspaper(300,300)
let newPaper2 = new Newspaper(300,300)
let newPaper3 = new Newspaper(300,300)
let paperArray = [newPaper, newPaper2, newPaper3]
let neighborhood = [newHouse, newHouse2]
let thrownPapersRight = []
let thrownPapersLeft = []

//check for when a house slides off the screen, remove it from neighborhood and add it back to the top

function houseMover(){
    neighborhood.forEach((house)=>{
        house.render()
        house.slide()
        if(house.y > 300){
            house.y = -30
        }
    })
}

function paperThrowHandler(){
    //when key is pressed - remove paper from paperArray and add to new thrownPapers array
    if(pressedKeys.a){
        thrownPapersLeft.push(paperArray[0])
        paperArray.shift()
    }
    if(pressedKeys.d){
        thrownPapersRight.push(paperArray[0])
        paperArray.shift()
    }
    //render and move all papers that have been thrown
    for(let i = 0; i < thrownPapersLeft.length; i++){
        thrownPapersLeft[i].render()
        thrownPapersLeft[i].flyLeft()
    }
    for(let i = 0; i < thrownPapersRight.length; i++){
        thrownPapersRight[i].render()
        thrownPapersRight[i].flyRight()
    }
}


function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    houseMover()
    // newHouse.render()
    // newHouse.slide()
    paperThrowHandler()
    //testing functionality
    detectPaperDelivery()
}


