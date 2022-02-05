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
    gameLoopInterval = setInterval(gameLoop, 500) //game speed set by interval

})

document.addEventListener('keydown',(e)=>{
    for(let i = 0; i < paperArray.length; i++){
        if(e.key === "a"){
            //displays flying paper when key is held.  need to somehow call these functions in the gameloop when event/keypress happens.
            paperArray[i].render()
            paperArray[i].flyLeft()
            console.log(`user pressed ${e.key}`)
        }else if(e.key === "d"){
            paperArray[i].render()
            paperArray[i].flyRight()
            console.log(`user pressed ${e.key}`)
        }
    }
})



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
    //check if a paper went into a houses rectangle.
    paperArray.forEach((paper)=>{
        if(paper.x < 200){
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

//every tick, move all houses down the y axis.
function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore

    //when key is pressed - get next newspaper out of newspaper array
    //render newspaper, set newspaper in motion

    


    //        weston recommendation for letting papers fly
    // for(let i = 0; i < paperArray.length; i++){
    //     paperArray[i].render()
    //     if(e.key === "a"){
    //         paperArray[i].flyLeft
    //     }
    //     if(e.key === "d"){
    //         paperArray[i].flyRight
    //     }
    // }



    //testing functionality
    // newHouse.render()
    // newPlayer.render()
    // newPaper.render()
    // newPaper.flyRight()
    // newHouse.slide()
    detectPaperDelivery()
}


