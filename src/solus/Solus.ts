import SolusHeart from "./SolusHeart"

// TODO: Fix animation speed (through performance.now())
// TODO: Some code refactoring

class Solus {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  mousePos: MousePos = {
    x: 0,
    y: 0,
    pressed: false
  }
  currentHeart: SolusHeart
  hearts: Array<SolusHeart>
  ws: WebSocket = location.hostname === 'localhost' ? new WebSocket('ws://localhost:4000/api') : new WebSocket('wss://solus.eugevin.ru/api')
  prev: number = performance.now()
  current: number = 0

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.currentHeart = new SolusHeart(this.canvas, this.ctx)
    this.hearts = [new SolusHeart(this.canvas, this.ctx)]
  }

  init(): void {
    this.resizeHandler()
    this.mouseHandler()
    this.socketHandler()
    this.drawLoop()
  }

  drawLoop(): void {
    requestAnimationFrame(this.drawLoop.bind(this))

    this.current = performance.now()

    if (this.current - this.prev < 1000 / 60) return

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.drawBg()
    this.drawHearts()
    this.drawCurrentHeart()

    this.prev = performance.now()
  }

  drawHearts(): void {
    this.hearts.forEach((heart) => {
      // TODO: Refactor code below, it's not okay (blinking hearts)
      /*if (heart.y < 0) {
        this.hearts.splice(i, 1)
        return
      }*/

      heart.update(heart.y < 100)
      heart.draw()
    })
  }

  drawCurrentHeart(): void {
    if (!this.mousePos.pressed) {
      this.currentHeart.alpha = 0

      return
    }

    this.currentHeart.alpha += 0.05

    this.currentHeart.x = this.mousePos.x
    this.currentHeart.y = this.mousePos.y
    this.currentHeart.draw()

    if (this.currentHeart.alpha > 1 && this.currentHeart.x !== 0 && this.currentHeart.y !== 0) {
      this.mousePos.pressed = false

      const x = this.currentHeart.x / this.canvas.width, y = this.currentHeart.y / this.canvas.height

      this.ws.send(JSON.stringify({ x, y, dy: this.currentHeart.dy }))

      this.currentHeart.dy = Number(Math.random().toFixed(1)) * 5 + 0.1
    }
  }

  drawBg(): void {
    this.ctx.fillStyle = 'hsla(300, 100%, 25%, 0.25)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  socketHandler(): void {
    this.ws.onmessage = (msg: any) => {
      let msgData

      msgData = JSON.parse(msg?.data) ?? null

      if (msgData.x && msgData.y && msgData.dy) {
        const heart = new SolusHeart(this.canvas, this.ctx)
        heart.x = this.canvas.width * msgData.x
        heart.y = this.canvas.height * msgData.y
        heart.dy = msgData.dy

        this.hearts.push(heart)
      }
    }
  }

  resizeHandler(): void {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetWidth * 0.5

    window.addEventListener('resize', () => {
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetWidth * 0.5
    })
  }

  mouseHandler(): void {
    this.canvas.addEventListener('mousemove', e => {
      const {x, y} = e

      const rect = this.canvas.getBoundingClientRect()

      this.mousePos.x = x - rect.left
      this.mousePos.y = y - rect.top
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.mousePos.pressed = false
    })

    this.canvas.addEventListener('mousedown', () => {
      this.mousePos.pressed = true
    })

    this.canvas.addEventListener('mouseup', () => {
      this.mousePos.pressed = false
    })
  }
}

export default Solus
