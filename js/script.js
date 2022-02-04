/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
const resetButton = document.querySelector(".reset-button")
const playButton = document.querySelector(".play-button")
//clears gameloop interval, rendering game over.  also clears canvas to blank state.
resetButton.addEventListener('click',()=>{
    clearInterval(gameLoopInterval)
})
playButton.addEventListener('click',()=>{
    // let gameLoopInterval = setInterval(gameLoop, 500) //game speed set by interval
})

document.addEventListener('keydown',(e)=>{
    if(e.key === "a"){
        console.log(`user pressed ${e.key}`)
        //when button is pressed
        //construct a new Newspaper object at deliverypersons x,y
        //render the object
        //get object to move correctly
    }else if(e.key === "d"){
       console.log(`user pressed ${e.key}`)
    }
})



/* GAME STATE */
const ctx = canvas.getContext('2d')
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
let userScore = 0

let gameLoopInterval = setInterval(gameLoop, 500) //game speed set by interval

/* GAME FUNCTIONS */

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
        // ctx.strokeRect(newPlayer.x,newPlayer.y,this.width,this.height)
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

//create paperboy

    //make paperboy throw newspaper

//every tick, move all houses down the y axis.
function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore

    //testing functionality
    newHouse.render()
    newPlayer.render()
    newPaper.render()
    newPaper.flyRight()
    newHouse.slide()
    
}


