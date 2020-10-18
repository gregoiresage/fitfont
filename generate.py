#!/usr/bin/env python
# coding: utf8
import argparse
import sys
import os
import json
from PIL import Image, ImageFont, ImageDraw
from struct import pack
import re

def generate(file_font, font_size, chars, stroke_width, destfolder):
  font = ImageFont.truetype(file_font, font_size)
  (fontname, _) = font.getname()
  fontname = re.sub("[^0-9a-zA-Z]+", "_", fontname)

  if stroke_width != 0 :
    outdir = ('%s/%s_%d_%d' % (destfolder, fontname, font_size, stroke_width)).replace(' ','_')
  else :
    outdir = ('%s/%s_%d' % (destfolder, fontname, font_size)).replace(' ','_')
  try: 
    os.makedirs(outdir)
  except OSError:
    if not os.path.isdir(outdir):
      raise

  ffile = open('%s/ff' % outdir,'wb')

  (ascent, descent) = font.getmetrics()
  ffile.write(pack(">BBB", 1, descent, ascent))

  chars = list(set(chars))
  chars.sort()

  for c in chars:
    ffile.write(pack(">H", ord(c)))

  for c in chars:
    (width, height), (offset_x, offset_y) = font.font.getsize(c)

    width += 2 * stroke_width
    height += 2 * stroke_width

    # hack to get the advance with of the character, the PIL library doesn't provide this value
    # but width("cc") = advance("c") + width("c")
    advance_width = font.getsize(c+c)[0] - font.getsize(c)[0]

    # # see http://www.rpmseattle.com/of_note/wp-content/uploads/2016/07/violin-clef-metrics.jpg
    ffile.write(pack(">BBBBB", width, height, -offset_x+stroke_width, (offset_y - stroke_width + 256) % 256, advance_width))

    if width != 0 and height != 0 :
      image = Image.new("L", (width, height), 0)
      draw  = ImageDraw.Draw(image)
      if stroke_width != 0 :
        draw.text((-offset_x,-offset_y),c,fill='black',font=font,stroke_fill='white',stroke_width=stroke_width)
      else :
        draw.text((-offset_x,-offset_y),c,fill='white',font=font)
      image.save('%s/%d.png' % (outdir, ord(c)))

  ffile.close()

  print('Files have been successfully generated in %s' % outdir)

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Generate font package')
  parser.add_argument('font',  help='The ttf font file')
  parser.add_argument('size',  help='The font size', type=int)
  parser.add_argument('chars', help='List of characters to generate', type=lambda s: s if sys.version_info[0] >= 3 else unicode(s, 'utf8'))
  parser.add_argument("-o", "--outline-width", help='Generate outlined font with the given stroke width', type=int, default=0)
  parser.add_argument("-d", "--dest", default='.')

  options = parser.parse_args()

  generate(options.font, options.size, options.chars, options.outline_width, options.dest)