import document from 'document'
import { readFileSync } from 'fs'

export function FitFont({ id, font, halign, valign, letterspacing }) {
  
  this.folder     = font
  this.root       = document.getElementById(id)
  this.container  = this.root.getElementById('c94f75cf')
  this.chars      = this.root.getElementsByClassName('083037')
  this._halign    = halign || 'start'
  this._valign    = valign || 'baseline'
  this._spacing   = letterspacing || 0
  
  
  try {
    this.info = readFileSync(`/mnt/assets/resources/${this.folder}/fonts.json`, 'json')
  } catch (e) {
    console.log(`Font ${this.folder} not found`)
    return
  }
  
  this.container.height = this.info.ascent + this.info.descent
  
  this.redraw = () => {
    let totalWidth = 0
    let i = 0
    const val=this._text
    for(i=0; i<val.length; i++) {
      if(this.info.widths[val[i]] === undefined) {
        console.log(`Char not found ${val[i]} in ${this.folder}`)
        this.chars[i].width = 0
        this.chars[i].href = ''
      }
      else {
        this.chars[i].href  = `${this.folder}/${val.charCodeAt(i)}.png`
        this.chars[i].width  = this.info.widths[val[i]]
        this.chars[i].x = totalWidth + this._spacing
        totalWidth += this.info.widths[val[i]] + this._spacing
      }
    }
    for(; i<this.chars.length; i++){
      this.chars[i].href = ''
      this.chars[i].width = 0
    }
    this.container.width = totalWidth
    switch(this._halign) {
      case 'middle':
        this.container.x = -totalWidth / 2
        break
      case 'end'   :
        this.container.x = -totalWidth
        break
      case 'start'   :
      default : 
        this.container.x = 0
        break
    }
    switch(this._valign) {
      case 'top' : 
        this.container.y = 0
        break
      case 'middle' :
        this.container.y = -this.container.height / 2
        break
      case 'bottom' :
        this.container.y = -this.container.height
        break
      case 'baseline' :
      default :
        this.container.y = -this.info.ascent
        break
    }
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