import { FitFont } from '../common/fitfont/fitfont'

import clock from 'clock'
import { preferences } from 'user-settings'

const DayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// declaration of the FitFont objects
const dayLbl  = new FitFont({ id:'dayLbl',  font:'Market_Saturday_80',  halign: 'middle', letterspacing: -5})
const hourLbl = new FitFont({ id:'hourLbl', font:'Market_Saturday_200', halign: 'middle'})

const updateClock = () => {
  const now = new Date()
  let hours = now.getHours()
  if (preferences.clockDisplay === '12h') {
    hours = hours % 12 || 12
  }
  const minutes = now.getMinutes()
  hourLbl.text = hours + '.' + ('0'+minutes).slice(-2)
  dayLbl.text  = DayNames[now.getDay()]
}

clock.granularity = 'minutes'
clock.ontick = (evt) => updateClock()

updateClock()