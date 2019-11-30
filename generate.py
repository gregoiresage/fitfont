#!/usr/bin/env python
# coding: utf8
import argparse
import os
import json
from PIL import Image, ImageFont, ImageDraw
from struct import pack
  
def generate(file_font, font_size, chars, destfolder):
  font = ImageFont.truetype(file_font, font_size)
  (fontname, fontfamily) = font.getname()

  outdir = ('%s/%s_%d' % (destfolder, fontname, font_size)).replace(' ','_')
  try: 
    os.makedirs(outdir)
  except OSError:
    if not os.path.isdir(outdir):
      raise

  ffile = open('%s/ff' % outdir,'wb')

  (ascent, descent) = font.getmetrics()
  ffile.write(pack(">BBB", 1, descent, ascent))

  chars = list(set(chars.decode('utf8')))
  chars.sort()

  for c in chars:
    ffile.write(pack(">H", ord(c)))

  for c in chars:
    (width, height), (offset_x, offset_y) = font.font.getsize(c)

    # hack to get the advance with of the character, the PIL library doesn't provide this value
    # but width("cc") = advance("c") + width("c")
    advance_width = font.getsize(c+c)[0] - font.getsize(c)[0]

    # # see http://www.rpmseattle.com/of_note/wp-content/uploads/2016/07/violin-clef-metrics.jpg
    ffile.write(pack(">BBBBB", width, height, -offset_x, offset_y, advance_width))

    if width != 0 and height != 0 :
      image = Image.new("L", (width, height), 0)
      draw  = ImageDraw.Draw(image)
      draw.text((-offset_x,-offset_y),c,255,font=font)
      image.save('%s/%d.png' % (outdir, ord(c)))

  ffile.close()

  print('Files have been successfully generated in %s' % outdir)

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Generate font package')
  parser.add_argument('font',  help='The ttf font file')
  parser.add_argument('size',  help='The font size', type=int)
  parser.add_argument('chars', help='List of characters to generate')
  parser.add_argument("-d", "--dest", default='.')

  options = parser.parse_args()

  generate(options.font, options.size, options.chars, options.dest)