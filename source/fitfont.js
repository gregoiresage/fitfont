import document from 'document'
import { readFileSync } from 'fs'

let fonts = {}

export function FitFont({ id, font, halign, valign, letterspacing }) {
  
  this.root       = document.getElementById(id)
  this.chars      = this.root.getElementsByClassName('fitfont-char')
  this._halign    = halign || 'start'
  this._valign    = valign || 'baseline'
  this._spacing   = letterspacing || 0
  
  if(fonts[font] === undefined) {
    try {
      fonts[font] = readFileSync(`/mnt/assets/resources/${font}/fonts.json`, 'json')
    } catch (e) {
      console.error(`Font ${font} not found`)
      return
    }
  }
  this.info = fonts[font] 

  this.redraw = () => {
    let totalWidth = 0
    let i = 0
    const val=this._text
    if(val.length > this.chars.length) {
      console.warn(`New element text larger than the number of characters of ${id}`)
    }
    while(i<val.length && i<this.chars.length) {
      const metrics = this.info.metrics[val[i]]
      if(metrics === undefined) {
        console.error(`Char not found ${val[i]} in ${font}`)
        this.chars[i].width = 0
        this.chars[i].href = ''
      }
      else {
        this.chars[i].width  = metrics[0]
        this.chars[i].height = metrics[1]
        this.chars[i].x = totalWidth + metrics[2]
        this.chars[i].y = metrics[3]
        totalWidth += metrics[4]
        if(i < val.length-1){
          totalWidth += this._spacing
        }
        this.chars[i].href  = `${font}/${val.charCodeAt(i)}.png`
      }
      i++
    }
    for(; i<this.chars.length; i++){
      this.chars[i].href  = ''

      this.chars[i].width = 0
    }
    
    let offx = 0
    let offy = 0
    switch(this._halign) {
      case 'middle': offx -= totalWidth/2; break
      case 'end'   : offx -= totalWidth; break
      case 'start' :
      default :      offx = 0; break
    }
    switch(this._valign) {
      case 'top' :    offy = 0; break
      case 'middle' : offy -= (this.info.ascent + this.info.descent)/2; break
      case 'bottom' : offy -= this.info.ascent + this.info.descent; break
      case 'baseline' :
      default :       offy -= this.info.ascent; break
    }

    this.chars.forEach(element => {
      element.x += offx
      element.y += offy
    })
  }
  
  Object.defineProperty(this, 'text', {
    get : () => {
        return this._text
    },
    set : (val) => {
        this._text = val
        this.redraw()
    }
  })
  
  Object.defineProperty(this, 'halign', {
    get : () => {
        return this._halign
    },
    set : (val) => {
        this._halign = val
        this.redraw()
    }
  })
  
  Object.defineProperty(this, 'valign', {
    get : () => {
        return this._valign
    },
    set : (val) => {
        this._valign = val
        this.redraw()
    }
  })
  
  Object.defineProperty(this, 'letterspacing', {
    get : () => {
        return this._spacing
    },
    set : (val) => {
        this._spacing = val
        this.redraw()
    }
  })
}