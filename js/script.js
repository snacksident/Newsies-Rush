/*DOM SELECTORS*/
const canvas = document.querySelector("#canvas")




/* GAME STATE */
const ctx = canvas.getContext('2d')
canvas.setAttribute("height", getComputedStyle(canvas)["height"])

canvas.setAttribute("width", getComputedStyle(canvas)["width"])

let gameLoopInterval = setInterval(gameLoop, 60) 
/* GAME FUNCTIONS */

//testing


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
        this.y += 5
    }
}

class Deliverer {
    constructor(xLoc, yLoc){
        this.x = xLoc,
        this.y = yLoc,
        this.width = 2,
        this.height = 6
    }
    render(){
        ctx.strokeStyle = 'green'
        ctx.lineWidth = 2
        ctx.strokeRect(this.x,this.y,this.width,this.height)
    }
}
let player = new Deliverer(200,300)

const house1 = new House(5,5)
const house2 = new House(500,5)

house1.render()
//create mockup route
    //create houses
        //or house boundaries


//create paperboy
//make paperboy move
//make paperboy throw newspaper

//every tick, move all houses down the y axis.
function gameLoop() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    house1.render()
    house2.render()
    player.render()
    house2.slide()
    house1.slide()
}