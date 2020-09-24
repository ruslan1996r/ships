
const myCanvas = document.getElementById("myCanvas")

const app = new PIXI.Application({
    view: myCanvas,
    width: window.innerWidth,
    height: window.innerHeight,
    antialias: true,
    backgroundColor: $BLUE
});
document.body.appendChild(app.view);


class Pier {
    constructor() {
        this.pier = new PIXI.Graphics();
        this.filled = false
        this.busy = false
        this.coords = {}
    }
    createPort(coords) {
        this.coords = coords
        const { x, y } = coords
        if (this.filled) {
            this.pier.beginFill($YELLOW);
        } else {
            this.pier.beginFill($BLUE);
        }
        this.pier.lineStyle(5, $YELLOW, 1);
        this.pier.drawRect(x, y, 50, 150);
        this.pier.endFill();
        app.stage.addChild(this.pier);
    }
    get coordsForShip() {
        return {
            x: this.coords.x + 60,
            y: this.coords.y + 30
        }
    }
    set updateFilled(filled) {
        this.filled = filled
        if (filled) {
            this.busy = true
        } else {
            this.busy = false
        }
        this.createPort({ x: this.coords.x, y: this.coords.y })
    }
}

const piersCoords = [10, 180, 350, 520]
const piers = piersCoords.map(pierY => {
    const pier = new Pier()
    pier.createPort({ x: 10, y: pierY })
    return pier
})
function findPier(filled) {
    console.log(filled)
    return filled ? piers.find(p => !p.busy) : piers.find(p => p.busy)
}

class Ship {
    constructor(shipType, filled) {
        this.shipType = shipType
        this.ship = new PIXI.Graphics();
        this.filled = filled
        this.coords = {}
    }

    createShip(coords) {
        this.coords = coords
        const { x, y } = coords
        if (this.shipType === "deliveryShip") {
            if (this.filled) {
                this.ship.beginFill($RED);
            } else {
                this.ship.beginFill($BLUE);
            }
            this.ship.lineStyle(5, $RED, 1);
        } else if (this.shipType === "dispatchShip") {
            if (this.filled) {
                this.ship.beginFill($GREEN);
            } else {
                this.ship.beginFill($BLUE);
            }
            this.ship.lineStyle(5, $GREEN, 1);
        }
        this.ship.drawRect(x, y, 200, 100);
        this.ship.endFill();
        app.stage.addChild(this.ship);
    }
    init() {
        const pier = findPier(this.filled)
        let tween = new TWEEN.Tween({ x: 0, y: 0 })
            .to({
                x: pier.coordsForShip.x - this.coords.x,
                y: pier.coordsForShip.y
            }, 500)
            .onUpdate(this.update.bind(this))
            .onComplete(() => {
                pier.updateFilled = this.filled
            })
        let tweenBack = new TWEEN.Tween({
            x: pier.coordsForShip.x - this.coords.x,
            y: pier.coordsForShip.y
        })
            .to({ x: 0, y: 0 }, 1000)
            .delay(500)
            .onStart(this.onStart.bind(this))
            .onUpdate(this.onUpdate.bind(this))
            .onComplete(() => {
                this.ship.destroy()
            })

        tween.chain(tweenBack)
        tween.start()
    }
    animate(time) {
        function animate() {
            const id = requestAnimationFrame(animate)
            const result = TWEEN.update(time)
            if (!result) cancelAnimationFrame(id)
        }
        animate()
    }
    onStart() {
        this.filled = !this.filled
        this.createShip({
            x: this.coords.x,
            y: this.coords.y,
        })
    }
    onUpdate(values) {
        this.ship.x = values.x
        this.ship.y = values.y
    }
    update(values) {
        this.ship.x = values.x
        this.ship.y = values.y
    }
}

// class DeliveryShip extends Ship {
//     constructor(params) {
//         super(params)
//     }
// }

// class DispatchShip extends Ship {
//     constructor(params) {
//         super(params)
//     }
// }

// console.log(new DispatchShip("name", false))

function generateShip(startedNumber) {
    const randomNumber = startedNumber || Math.floor(Math.random() * 2)
    console.log(randomNumber)
    const randomShip = ['dispatchShip', 'deliveryShip'][randomNumber]
    const myShip = new Ship(randomShip, randomNumber)
    myShip.createShip({ x: 1500, y: 0 })
    myShip.init()
    myShip.animate()
}

generateShip(1)
setInterval(() => {
    generateShip()
}, 2000)

window.generate = generateShip