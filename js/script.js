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


/* kind of works, needs a re-visit */
/* currently will tell a paper it was delivered if the house slides into it from the top as well*/
function detectPaperDelivery(){
    //check if a papers left side crossed into the "left boundary"
    thrownPapersLeft.forEach((paper)=>{
        if(paper.x < 55){
            //check if it hit the correct Y value of the each house as well
            neighborhoodLeft.forEach(house=>{
                if(paper.y < house.y + house.height && paper.y > house.y){
                    console.log(`house on left hit!!`)
                    thrownPapersLeft.shift()
                }
            })
        }
    })
    //check if paper crossed into the "right boundary"
    thrownPapersRight.forEach((paper)=>{
        if(paper.x + paper.width > 600){
            neighborhoodRight.forEach(house=>{
                //check if it hit corrects y value of house
                if(paper.y < house.y + house.height && paper.y > house.y){
                    console.log(`house on right hit!!!!`)
                    thrownPapersRight.shift()
                }
            })
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


let leftHouse = new House(5,5)
let leftHouse2 = new House(5,115)
let leftHouse3 = new House(5,225)
let rightHouse = new House(600,5)
let rightHouse2 = new House(600, 100)
let rightHouse3 = new House(600,230)
let newPlayer = new Deliverer(300,300)
let newPaper = new Newspaper(300,300)
let newPaper2 = new Newspaper(300,300)
let newPaper3 = new Newspaper(300,300)
let newPaper4 = new Newspaper(newPlayer.x,newPlayer.y)
let paperArray = [newPaper, newPaper2, newPaper3, newPaper4]
let neighborhood = [leftHouse, rightHouse, leftHouse2, rightHouse2, leftHouse3, rightHouse3]
let neighborhoodLeft = [leftHouse, leftHouse2, leftHouse3]
let neighborhoodRight = [rightHouse, rightHouse2, rightHouse3]
let thrownPapersRight = []
let thrownPapersLeft = []

//check for when a house 'slides off' the screen, remove it from neighborhood and add it back to the top - "endless" functionality
function houseMover(){
    neighborhood.forEach((house)=>{
        house.render()
        house.slide()
        if(house.y > 300){
            house.y = -80
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
    detectPaperDelivery()
}


function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    houseMover()
    newPlayer.render()
    paperThrowHandler()
    //testing functionality
}


