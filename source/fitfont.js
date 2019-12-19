import document from 'document'
import { readFileSync } from 'fs'
import { memory } from 'system';
import * as fs from 'fs';

let fonts = {}

const CURRENT_VERSION = 1

const INDEX_VERSION = 0
const INDEX_DESCENT = 1
const INDEX_ASCENT  = 2
const INDEX_CHARS   = 3

const BYTES_PER_CHAR = 2
const INFO_PER_CHAR  = 5
const TOTAL_BYTES_PER_CHAR = BYTES_PER_CHAR + INFO_PER_CHAR


const getCharIndex = (info, c) => {
  const count = (info.length - INDEX_CHARS) / TOTAL_BYTES_PER_CHAR

  let min = 0
  let max = count - 1

  // Check if the character is in the list
  if (((info[BYTES_PER_CHAR*min] << 8) + info[BYTES_PER_CHAR*min+1]) > c || ((info[BYTES_PER_CHAR*max] << 8) + info[BYTES_PER_CHAR*max+1]) < c) {
    return -1
  }

  // use dichotomic search
  while (min <= max) {
    const id = Math.round((max + min) / 2)
    let val = (info[BYTES_PER_CHAR*id] << 8) + info[BYTES_PER_CHAR*id+1]

    if (val === c) {
      return INDEX_CHARS + INFO_PER_CHAR * id + BYTES_PER_CHAR * count
    } else if (val > c) {
      max = id - 1
    } else {
      min = id + 1
    }
  }

  return -1
}

export function FitFont({ id, font, halign, valign, letterspacing }) {
  
  this.root       = typeof id === 'string' ? document.getElementById(id) : id
  this.chars      = this.root.getElementsByClassName('fitfont-char')

  this._halign    = halign || 'start'
  this._valign    = valign || 'baseline'
  this._spacing   = letterspacing || 0
  this._text      = ''

  this._width     = 0
  this._ascent    = 0
  this._descent   = 0

  if(fonts[font] === undefined) {
    try {
      const fName = '/mnt/assets/resources/' + font + '/ff'
      let stats = fs.statSync(fName)
      let file = fs.openSync(fName, 'r')

      const buffer = new ArrayBuffer(stats.size)
      fs.readSync(file, buffer, 0, stats.size, 0)
      fs.closeSync(file)

      let bytes = new Uint8Array(buffer)

      // Check if the binary file has the right format
      if (bytes[INDEX_VERSION] !== CURRENT_VERSION) {
        return
      }

      fonts[font] = bytes

    } catch (e) {
      console.error(`Font ${font} not found`)
      return
    }
  }
  
  this._info = fonts[font]

  this.redraw = () => {
    const val = this._text + ''

    let totalWidth = 0
    let i = 0

    while (i<val.length && i<this.chars.length) {
      const charCode = val.charCodeAt(i)
      let index = getCharIndex(this._info, charCode)
      const charElem = this.chars[i]
      if (index === -1) {
        // Char not found in the font
        // console.error(`Char not found ${val[i]} in ${font}`)
        charElem.href = ''
      }
      else {
        charElem.width  = this._info[index++]
        charElem.height = this._info[index++]
        charElem.x      = totalWidth - this._info[index++]
        charElem.y      = this._info[index++]
        if (charElem.y > 128) charElem.y -= 256
        totalWidth     += this._info[index++]
        charElem.href   = font + '/' + charCode + '.png'
      }
      if (i < val.length-1) {
        totalWidth += this._spacing
      }
      i++
    }

    for(; i<this.chars.length; i++){
      this.chars[i].href = ''
    }

    this._width = totalWidth

    let offx = 0
    switch (this._halign) {
      case 'middle': offx -= totalWidth/2; break
      case 'end'   : offx -= totalWidth; break
    }

    let offy = 0
    switch (this._valign) {
      case 'top' :    offy = 0; break
      case 'middle' : offy -= (this._info[INDEX_ASCENT] + this._info[INDEX_DESCENT]) / 2; break
      case 'bottom' : offy -=  this._info[INDEX_ASCENT] + this._info[INDEX_DESCENT]; break
      case 'baseline' :
      default :       offy -= this._info[INDEX_ASCENT]; break
    }

    for (i=0; i<this.chars.length; i++){
      this.chars[i].x += offx
      this.chars[i].y += offy
    }
  }
  
  Object.defineProperty(this, 'text', {
    get : () => {
      return this._text
    },
    set : (val) => {
      if (this._text === val) 
        return
      this._text = val
      this.redraw()
    }
  })
  
  Object.defineProperty(this, 'halign', {
    get : () => {
      return this._halign
    },
    set : (val) => {
      if (this._halign === val) 
        return
      this._halign = val
      this.redraw()
    }
  })
  
  Object.defineProperty(this, 'valign', {
    get : () => {
      return this._valign
    },
    set : (val) => {
      if (this._valign === val) 
        return
      this._valign = val
      this.redraw()
    }
  })
  
  Object.defineProperty(this, 'letterspacing', {
    get : () => {
      return this._spacing
    },
    set : (val) => {
      if (this._spacing === val) 
        return
      this._spacing = val
      this.redraw()
    }
  })

  Object.defineProperty(this, 'width', {
    get : () => {
      return this._width
    }
  })
}