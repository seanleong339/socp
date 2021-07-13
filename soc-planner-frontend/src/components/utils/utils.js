
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