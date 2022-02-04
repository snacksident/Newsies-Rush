/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
document.addEventListener('keydown',(e)=>{
    if(e.key === "a"){
        
        //player.throwPaper()
    }else if(e.key === "d"){
       // player.throwPaper()
    }
})



/* GAME STATE */
const ctx = canvas.getContext('2d')
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
let userScore = 0
let gameLoopInterval = setInterval(gameLoop, 1000) //game speed set by interval

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
    //change the y axis of the house, making it feel like you are moving.
    slide(){
        this.y++
    }
}

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

class Newspaper {
    static paperCount = 0
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
    //'slide' through neighborhood until timer runs out or finish line is it
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    // newHouse.render()
    newPlayer.render()
    // newPaper.render()
    newHouse.slide()
}


//when button is pressed
//construct a new Newspaper object
//render the object on the delivery person
//get object to move correctly