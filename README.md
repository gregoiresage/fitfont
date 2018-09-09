# FitFont for Fitbit

This library allows you to easily display text with custom fonts.

[![Support via PayPal](https://cdn.rawgit.com/twolfson/paypal-github-button/1.0.0/dist/button.svg)](https://www.paypal.me/gsage/)

![alt text](screenshot.png "Sorry for the colors")

## With the Fitbit CLI

### Installation

Install the library with `npm i fitfont`

   The installer will ask you if it can copy the library gui files in your `resources` folder:  
   Press `Y` and the `fitfont.gui` file will be created automatically.  
   Press `N` if you prefer to copy the file manually afterwards (default choice is Yes)  
  
You still need to modify the `resources/widgets.gui` file to add the link to `fitfont.gui`:
``` xml
<svg>
    <defs>
        <link rel="stylesheet" href="styles.css" />
        <link rel="import" href="/mnt/sysassets/widgets_common.gui" />
        <!-- import FitFont ui file -->
        <link rel="import" href="fitfont.gui" />
    </defs>
</svg>
```

### Assets generation

Download your favourite ttf font and generate the library needed files with:
```
  npx fitfont-generate [path/to_the_font_file]  [font_size]  [list_of_characters_to_generate]
```
e.g.
```
  npx fitfont-generate /path/to/my_cool_font.ttf 200 0123456789:.
```
The generated folder (named [font_name]_[font_size]) will be automatically copied in your `resources` folder.

Repeat this for every font/size you need.


## Without the Fitbit CLI (shame on you)

### Library integration

Copy the `fitfont.js` file in your `app` folder.

Copy the `fitfont.gui` file in your `resources` folder.

Modify the `resources/widgets.gui` file to add the link to `fitfont.gui`:
``` xml
<svg>
    <defs>
        <link rel="stylesheet" href="styles.css" />
        <link rel="import" href="/mnt/sysassets/widgets_common.gui" />
        <!-- import FitFont ui file -->
        <link rel="import" href="fitfont.gui" />
    </defs>
</svg>
```

### Assets generation

Install the python dependencies:
```
  pip install Pillow
```

Download your favourite font file and call the python `generator.py` script of this repo.
```
  python generate.py [path/to_the_font_file]  [font_size]  [list_of_characters_to_generate]
```
e.g.
```
  python generate.py /path/to/my_cool_font.ttf 200 0123456789:.
```

Copy the generated folder (named [font_name]_[font_size]) in your project's `resources` folder.

Repeat this for every font/size you need.

# Usage

Use a `fitfont` symbol in your `index.gui` file:
``` xml
    <use href="#fitfont" id="myLabel">
        <use href="#fitfont-character"/>
        <use href="#fitfont-character"/>
        <use href="#fitfont-character"/>
        <use href="#fitfont-character"/>
        <use href="#fitfont-character"/>
        <use href="#fitfont-character"/>
        <!-- add as many characters as needed -->
    </use>
```

Import and use the library in your `app/index.js`:
``` javascript
    import { FitFont } from 'fitfont'
    // or if you are not using the CLI : import { FitFont } from './fitfont.js'
    
    const myLabel = new FitFont({ 
        id:'myLabel',               // id of your symbol in the index.gui
        font:'Market_Saturday_200'  // name of the generated font folder

        // Optional
        halign: 'start',            // horizontal alignment : start / middle / end
        valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
        letterspacing: 0            // letterspacing...
        })
    
    myLabel.text = '12:55'          // only the characters generated with the python script will be displayed

    // It is also possible to change the halign/valign/letterspacing dynamically
    myLabel.halign = 'middle'
    myLabel.valign = 'top'
    myLabel.letterspacing = -3
```

Launch your app and enjoy.
