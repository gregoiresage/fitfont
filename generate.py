#!/usr/bin/env python
import argparse
import os
import json
from PIL import Image, ImageFont, ImageDraw
  
def generate(file_font, font_size, chars):
  font = ImageFont.truetype(file_font, font_size)
  (fontname, fontfamily) = font.getname()

  outdir = ('%s_%d' % (fontname, font_size)).replace(' ','_')
  try: 
    os.makedirs(outdir)
  except OSError:
    if not os.path.isdir(outdir):
      raise

  (ascent, descent) = font.getmetrics()
  info = {
    'descent' : descent,
    'ascent'  : ascent,
    'metrics' : {}
  }

  for c in chars:
    width         = font.getsize(c)[0]
    offset_x      = font.getoffset(c)[0]
    # hack to get the advance with of the character, the PIL library doesn't provide this value
    # but width("cc") = advance("c") + width("c")
    advance_width = font.getsize(c+c)[0] - width

    # see http://www.rpmseattle.com/of_note/wp-content/uploads/2016/07/violin-clef-metrics.jpg
    info['metrics'][c] = [
      width,         # width
      offset_x,      # left side bearing
      advance_width] # advance width

    image = Image.new("L", (width, ascent+descent), 0)
    draw  = ImageDraw.Draw(image)
    draw.text((-offset_x,0),c,255,font=font)
    image.save('%s/%d.png' % (outdir, ord(c)))

  with open('%s/fonts.json' % outdir, 'wb') as fp:
    json.dump(info, fp)

if __name__ == "__main__":
  parser = argparse.ArgumentParser(version='1.0',description='Generate font package')
  parser.add_argument('font',  help='The ttf font file')
  parser.add_argument('size',  help='The font size', type=int)
  parser.add_argument('chars', help='List of characters to generate')

  options = parser.parse_args()

  generate(options.font, options.size, options.chars)