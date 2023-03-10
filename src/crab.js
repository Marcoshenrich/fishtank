import Denizen from "./denizen";
import Swimmer from "./swimmer";

export default class Crab extends Swimmer {

    constructor(id, ctx, canvas, view, logic) {
        super(ctx, canvas, view, logic)
        this.id = "Crab" + id
        this.img = new Image()
        this.img.src = './dist/art/crab.png'
        this.height = 15
        this.width = 30
        this.pos = [Math.floor(Math.random() * this.arenaWidth - this.width), this.arenaHeight - this.height]
        this.speed = Math.floor(Math.random() * 4)/10
        this.maxSpeed = .4
        this.up = false
        this.right = [true, false][Math.floor(Math.random() * 2)]
        this.recentlySwitchedDirections = false

        this.timeToClimbSeaweed = false
        this.onSeaweed = false

        this.seaweedSpots = this.seaweedFinder()
        this.climbSeaweedTimer()

    }


    climbSeaweedTimer() {
        setTimeout(() => {
            this.timeToClimbSeaweed = !this.timeToClimbSeaweed
            this.climbSeaweedTimer()
        }, Math.floor(Math.random() * this.timeToClimbSeaweed ? 6000 : 30000))
    }

    seaweedFinder() {
        let seaweedSpots = {}
        Object.values(this.logic.seaweedClusters).forEach((seaweedCluster) => {
            seaweedSpots[(seaweedCluster.pos[0] + Object.values(seaweedCluster.seaweed)[0].width / 2)] = seaweedCluster
        })
        return seaweedSpots
    }

    movementSwitchTimer() {
        setTimeout(() => {
            this.timeToSwitchMovement = true
            this.movementSwitchTimer()
        }, Math.floor(Math.random() * 2500) + 7000)
    }

    coreloop() {
        this.move()
        this.draw()
    }  


    draw(){
        this.ctx.drawImage(this.img, this.pos[0] + this.offset[0], this.pos[1] + this.offset[1], this.width, this.height)
    }


    travelLand() {

        if (this.pos[0] > this.arenaWidth - this.width || this.pos[0] < 0) {
            this.switchDirections()
        }

        if (this.right) {
            this.pos[0] += this.speed
        } else {
            this.pos[0] -= this.speed
        }
    }


    climbSeaweed(climbBool) {
        if (climbBool) {
            if (this.pos[1] < this.onSeaweed.tallestPoint + this.height || this.pos[1] > this.arenaHeight - this.height) {
                this.switchDirections()
            }

            if (!this.right) {
                this.pos[1] += this.speed
            } else {
                this.pos[1] -= this.speed
            }
            return
        }

        this.pos[1] += this.speed
        if (this.pos[1] > this.arenaHeight - this.height) {
            this.onSeaweed = false
        }
    }







    move() {
        if (!this.onSeaweed && this.timeToClimbSeaweed && (Math.floor(this.pos[0]) in this.seaweedSpots) ) {
            this.onSeaweed = this.seaweedSpots[Math.floor(this.pos[0])]
        }

        if (this.onSeaweed && !this.timeToClimbSeaweed) {
            this.climbSeaweed(false)
            return
        }

        if (this.onSeaweed) {
            this.climbSeaweed(true)
        } else {
            this.travelLand()
        }

        if (this.timeToSwitchMovement) {
            Object.values(this.movementSwitches)[Math.floor(Math.random() * Object.values(this.movementSwitches).length)]()
            this.timeToSwitchMovement = false
        }
        
    }

    movementSwitches = {

        reverseSide: () => {
            this.right = !this.right;
        },

        reverseSide2: () => {
            this.right = !this.right;
        },

        speedUp: () => {
            if (this.speed < this.maxSpeed) this.speed += .05
        },

        slowDown: () => {
            if (this.speed > .1) this.speed -= .05
        },

        chill: () => {
            this.speed = 0
            setTimeout(()=>{
                this.speed = .3
            },Math.floor(Math.random() * 9000) +  1000)
        }
    }

    switchDirections() {
        if (this.recentlySwitchedDirections) return
        this.right = !this.right;
        this.recentlySwitchedDirections = true
        setTimeout(() => { this.recentlySwitchedDirections = false }, 350)
    }




}

