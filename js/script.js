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

// document.addEventListener('keydown',(e)=>{
//         pressedKeys.push(e.key)
// })
// document.addEventListener('keyup', (e)=>{
//     pressedKeys.pop(e.key)
// })

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

function detectPaperDelivery(){
    //check if a paper went into a *left side* houses bounds.
    paperArray.forEach((paper)=>{
        if(paper.x < 200){
            console.log(`${paper} has crossed ${paper.x} x boundary`)
        }
        if(paper.x + paper.width > 500){
            console.log(`${paper} has crossed ${paper.x} x boundary`)
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
        this.y++
    }
    flyLeft(){
        this.x -=2
        this.y++
    }
}

let newHouse = new House(5,5)
let newPlayer = new Deliverer(300,300)
let newPaper = new Newspaper(300,300)
let newPaper2 = new Newspaper(300,300)
let newPaper3 = new Newspaper(300,300)
let paperArray = [newPaper, newPaper2, newPaper3]
let thrownPapersRight = []
let thrownPapersLeft = []

function paperThrowHandler(){

}

//every tick, move all houses down the y axis.
function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore


    //when key is pressed - get next newspaper out of newspaper array
    //render newspaper, set newspaper in motion

    //currently only renders/moves paper when button is pressed.  ideal reaction is: when button is pressed, render next newspaper in array and set in motion.
    for(let i = 0; i < paperArray.length; i++){
        if(pressedKeys.a){
            thrownPapersLeft.push(paperArray[i])
        }
        if(pressedKeys.d){
            thrownPapersRight.push(paperArray[i])
        }
    }
    


    //testing functionality
    detectPaperDelivery()
}


