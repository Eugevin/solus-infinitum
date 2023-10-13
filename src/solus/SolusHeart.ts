class SolusHeart {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  x: number = 0
  y: number = 0
  created: boolean = false
  size: number = 0
  alpha: number = 0
  dy: number = Number(Math.random().toFixed(1)) * 5 + 0.1

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
  }

  draw(): void {
    this.ctx.save()

    this.ctx.globalAlpha = this.alpha

    this.ctx.font = '24px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillStyle = '#000'
    this.ctx.fillText('💖', this.x, this.y)

    this.ctx.restore()

    if (this.alpha === 1) this.created = true
    if (!this.created) this.alpha = Number((this.alpha + 0.05).toFixed(2))
  }

  update(hide: boolean): void {
    this.y -= this.dy

    if (!hide) return

    this.alpha = this.alpha === 0 ? this.alpha : this.alpha = Number((this.alpha - 0.01).toFixed(2))
  }
}

export default SolusHeart
