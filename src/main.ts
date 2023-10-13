import './styles.scss'
import Solus from './solus/Solus'

window.addEventListener('DOMContentLoaded', () => {
  const appEl = document.querySelector('#app') as HTMLElement

  renderAppHTML(appEl)

  const canvasEl = document.querySelector('#app canvas') as HTMLCanvasElement 

  const app = new Solus(canvasEl)
  app.init()
})


function renderAppHTML(appEl: HTMLElement) {
  const templateHTML = `
    <canvas></canvas>
    <p>“Realize that everything connects to everything else”<br>- Leonardo DaVinci</p>
  `

  appEl.innerHTML = templateHTML
}
