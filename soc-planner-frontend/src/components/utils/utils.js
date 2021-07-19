
// return whether study plan is empty
export const planIsEmpty = (inputPlan) => {
    return inputPlan.y1s1.length === 0 
      && inputPlan.y1s2.length === 0
      && inputPlan.y2s1.length === 0
      && inputPlan.y2s2.length === 0
      && inputPlan.y3s1.length === 0
      && inputPlan.y3s2.length === 0
      && inputPlan.y4s1.length === 0
      && inputPlan.y4s2.length === 0
}

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const timeSince = (dateInput) => {
  var date = new Date(dateInput)
  var seconds = Math.floor((new Date().getTime() - date) / 1000)
  var interval = seconds / 31536000

  if (interval > 1) {
    const time = Math.floor(interval)
    return time === 1 ? time + " year" : time + " years" 
  }
  interval = seconds / 2592000
  if (interval > 1) {
    const time = Math.floor(interval)
    return time === 1 ? time + " month" : time + " months" 
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const time = Math.floor(interval)
    return time === 1 ? time + " day" : time + " days" 
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const time = Math.floor(interval)
    return time === 1 ? time + " hour" : time + " hours" 
  }
  interval = seconds / 60;
  if (interval > 1) {
    const time = Math.floor(interval)
    return time === 1 ? time + " minute" : time + " minutes" 
  }
  return "few seconds";

}