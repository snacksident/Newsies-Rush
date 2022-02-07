/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")
const scoreBoard = document.querySelector(".score-board")
const paperCountDisplay = document.querySelector(".paper-count")
const resetButton = document.querySelector(".reset-button")
const playButton = document.querySelector(".play-button")


//clears gameloop interval, rendering game over.  also clears canvas to blank state.
//currently functions like a pause button.  screen gets cleared but all rendered objects still have their positions set.
resetButton.addEventListener('click',()=>{
    clearInterval(gameLoopInterval)
    ctx.clearRect(0,0, canvas.width, canvas.height)
})
playButton.addEventListener('click',()=>{
    gameLoopInterval = setInterval(gameLoop, 60) //game speed set by interval
})

//tracking keypresses inside object with boolean values.  
let pressedKeys = {}
document.addEventListener('keydown', e => pressedKeys[e.key] = true)
document.addEventListener('keyup', e => pressedKeys[e.key] = false)


/* GAME STATE */
const ctx = canvas.getContext('2d')
canvas.setAttribute("height", getComputedStyle(canvas)["height"])
canvas.setAttribute("width", getComputedStyle(canvas)["width"])
let userScore = 0

// currently turning gameloopinterval on and off with the "play game" and "end game" buttons. end game clears screen but pauses object statuses.
let gameLoopInterval;
/* GAME FUNCTIONS */


/* kind of works, needs a re-visit */
/* currently will tell a paper it was delivered if the house slides into it from the top as well*/
function detectPaperDelivery(){
    //check if a papers left side crossed into the "left boundary"
    thrownPapersLeft.forEach((paper)=>{
        //left side value hard coded in as no houses will be placed beyond 55px mark for now
        if(paper.x < 55){
            //check if it hit the correct Y value of the each house as well
            neighborhoodLeft.forEach(house=>{
                if(paper.y < house.y + house.height && paper.y > house.y){
                    console.log(`house on left hit!!`)
                    if(house.isSubscriber){
                        userScore += 1000
                    }
                    thrownPapersLeft.shift()
                }
            })
        }
    })
    //check if paper crossed into the "right boundary"
    thrownPapersRight.forEach((paper)=>{
        //right side value hard coded in as houses will only be placed on the 600px mark for now
        if(paper.x + paper.width > 600){
            neighborhoodRight.forEach(house=>{
                //check if it hit corrects y value of house
                if(paper.y < house.y + house.height && paper.y > house.y){
                    console.log(`house on right hit!!!!`)
                    if(house.isSubscriber){
                        userScore += 1000
                    }
                    thrownPapersRight.shift()
                }
            })
        }
    })
}

//houses all have a standard size.  we only pass in location of the house.
class House {
    constructor(xLoc,yLoc,subscriberStatus){
        this.x = xLoc,
        this.y = yLoc,
        this.width = 50,
        this.height = 80
        this.isSubscriber = subscriberStatus
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
        this.x += 5
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
    flyLeft(){
        this.x -=5
        // this.y++ /*for making the papers fly 'down' the screen too*/
    }
}


let leftHouse = new House(5,5,false)
let leftHouse2 = new House(5,115,true)
let leftHouse3 = new House(5,225,false)
let rightHouse = new House(600,5,true)
let rightHouse2 = new House(600, 100,false)
let rightHouse3 = new House(600,230,true)
let newPlayer = new Deliverer(300,300)
let newPaper = new Newspaper(newPlayer.x,newPlayer.y)
let newPaper2 = new Newspaper(newPlayer.x,newPlayer.y)
let newPaper3 = new Newspaper(newPlayer.x,newPlayer.y)
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
        if(house.y > 350){
            house.y = -80
            house.isSubscriber = subscriberRandomizer()
        }
    })
}

//checks key press inputs for 4 movement directions
function delivererMover(){
    if(pressedKeys.a){
        newPlayer.x -= 2
    }
    if(pressedKeys.d){
        newPlayer.x += 2
    }
    if(pressedKeys.w){
        newPlayer.y -= 2
    }
    if(pressedKeys.s){
        newPlayer.y += 2
    }
}
//randomly selects if a house is a subscriber or not when being replaced
function subscriberRandomizer(){
    let rand = Math.floor(Math.random() * 2)
    if(rand === 1){
        return true
    }
    else{
        return false
    }
}

function paperThrowHandler(){
    //when key is pressed - remove paper from paperArray and add to new thrownPapers array
    if(paperArray.length != 0){
        if(pressedKeys.q){
            //set paper location to users current location
            paperArray[0].x = newPlayer.x
            paperArray[0].y = newPlayer.y
            //move into separate array depending on direction its thrown
            thrownPapersLeft.push(paperArray[0])
            paperArray.shift()
        }
        if(pressedKeys.e){
            //set paper location to users current location
            paperArray[0].x = newPlayer.x
            paperArray[0].y = newPlayer.y
            //move into separate array depending on direction its thrown
            thrownPapersRight.push(paperArray[0])
            paperArray.shift()
        }
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

//checks to see if all newspaper arrays are empty (out of paper) - no more ways to get points
function gameOverCheck(){
    if(paperArray.length === 0 && thrownPapersLeft.length == 0 && thrownPapersRight == 0){
        console.log("game over you're out of newspapers")
    }
}

function gameLoop() {
    //generate houses(neighborhood)
    ctx.clearRect(0,0, canvas.width, canvas.height)
    scoreBoard.innerText = userScore
    paperCountDisplay.innerText = paperArray.length + "papers left"
    houseMover()
    delivererMover()
    newPlayer.render()
    paperThrowHandler()
    gameOverCheck()
    //testing functionality
}


