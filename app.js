const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
c.fillRect(0,0,canvas.width,canvas.height)
const gravity = 0.2

const keys = {
    a:{
        pressed : false
    },
    d:{
        pressed : false
    },
    w:{
        pressed:false
    },
    ArrowLeft:{
        pressed : false
    },
    ArrowRight:{
        pressed : false
    },
    ArrowUp:{
        pressed : false
    }
}
let lastKey = ""

class Sprite {
    constructor({position,velocity,color = 'red', offset}){
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50 
        this.health = 100
        this.lastKey 
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50 
        }
        this.isAttacking
        this.color = color
    }
    draw(){
        c.fillStyle= this.color
        c.fillRect(this.position.x,this.position.y,this.width,this.height)

        //attack Box 
        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x,this.attackBox.position.y,this.attackBox.width,this.attackBox.height)
        }
    }
    update(){
        this.draw()
        this.attackBox.position.x = this.position.x +this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + this.height + this.velocity.y  >= canvas.height){
            this.velocity.y = 0
        }else this.velocity.y += gravity
    }
    attack(){
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}

const player = new Sprite ({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset :{
        x : 0,
        y : 0
    }
})

player.draw()

const enemy = new Sprite({
    position: {
        x:400,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
    offset:{
        x: -50,
        y: 0
    },
    color: 'blue'
})

function rectangelcolor({rectangel1,rectangel2}){
    return(
        rectangel1.attackBox.position.x + rectangel1.attackBox.width >= rectangel2.position.x 
        && rectangel1.attackBox.position.x <= rectangel2.position.x + rectangel2.width
        && rectangel1.attackBox.position.y + rectangel1.attackBox.height >= enemy.position.y
        && rectangel1.attackBox.position.y <= rectangel2.position.y + rectangel2.height
    )
}
function winner({player , enemy,timerId}){
    clearTimeout(timerId)
    if(player.health === enemy.health){
        document.querySelector('#displayTimer').innerHTML = 'Tie'
        document.querySelector('#displayTimer').style.display = 'flex'
     }else if(player.health > enemy.health){
        document.querySelector('#displayTimer').innerHTML = 'player 1 wins'
        document.querySelector('#displayTimer').style.display = 'flex'
     }else if(player.health < enemy.health){
        document.querySelector('#displayTimer').innerHTML = 'player 2 wins'
        document.querySelector('#displayTimer').style.display = 'flex'
     }
}
let timer = 60
let timerId 
function dec(){
    if (timer > 0){
        timerId = setTimeout(dec,1000)
        timer--
        document.querySelector('#timer').innerHTML=timer
    }
    if(timer === 0){
        winner({player,enemy,timerId})
    }
}
dec()
function animate(){
    window.requestAnimationFrame(animate)    
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    enemy.update()
    player.update()
    //player
    player.velocity.x = 0
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
    }else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }else if (keys.w.pressed && player.lastKey === 'w'){
        player.velocity.y =-2
    }
    //enemy
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
    }else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }else if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp'){
        enemy.velocity.y =-2
    }

    //detec for player 
    if(
        rectangelcolor({
            rectangel1:player,
            rectangel2:enemy
        })
        && player.isAttacking
    ){
        player.isAttacking = false
        console.log("go");
        enemy.health -= 20
        document.querySelector('#enemyhealth').style.width = enemy.health + '%'
        
    }
    if(
        rectangelcolor({
            rectangel1:enemy,
            rectangel2:player
        })
        && enemy.isAttacking
    ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerhealth').style.width = player.health + '%'
        console.log("go enemt");
        
    }
    //end game
    if(enemy.health <= 0 || player.health <= 0){
        winner({player,enemy,timerId})
    }
}
animate()

window.addEventListener('keydown', (event) => {
    switch(event.key){
        //player
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w' :
            player.lastKey = 'w'
            keys.w.pressed = true
            break
        case ' ' :
            player.attack()
            break
        //enemy
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.lastKey = 'ArrowUp'
            keys.ArrowUp.pressed = true
            break
        case 'ArrowDown' :
            enemy.attack()
            break
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key){
        //player
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break
        case 'w' :
            keys.w.pressed = false
            break
        //enemy
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp' :
            keys.ArrowUp.pressed = false
            break
    }
    console.log(event.key);
    
})