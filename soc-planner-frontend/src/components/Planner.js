import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Semester from './Semester'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles, IconButton, DialogContent, Slide } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import axios from '../dbAxios'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: '#00766c'
  },
  closeCheckButton: {
    backgroundColor: '#001c24',
    color: '#C8C8C8',
    '&:hover': {
      backgroundColor: '#2e4248',
      color: '#c8c8c8'
    }
  }
}))

const specialisations = {
  'computer science': [
    {name: "Artificial Intelligence", value: "ai"},
    {name: "Algorithms & Theory", value: "theory and algo"},
    {name: "Computer Graphics and Games", value: "computer graphics"},
    {name: "Computer Security", value: "computer security"},
    {name: "Database Systems", value: "database systems"},
    {name: "Multimedia Information Retrieval", value: "multimedia info"},
    {name: "Networking and Distributed Systems", value: "networking and distrbuted systems"},
    {name:  "Parallel Computing", value: "parallel computing"},
    {name: "Programming Languages", value: "programming languages"},
    {name: "Software Engineering", value: "software engineering"},
  ],
  'business analytics': [
    {name: "Financial Analytics", value: "financial analytics"},
    {name: "Marketing Analytics", value: "marketing analytics"}
  ], 
  'information systems': [
    {name: "Digital Innovation", value: "digital innovation"},
    {name: "Electronic Commerce", value: "electronic commerce"},
    {name: "Financial Technology", value: "financial technology"}
  ], 
  'information security': []
}

function showSpecialisations(major) {
  return (
    <>
    <option value="">General</option>
    {specialisations[major].map(x => (
      <option value={x.value}>{x.name}</option>
    ))}
    </>
  )
}


function capitalizeFirstLetterOfEachWord(words) {
  var separateWord = words.toLowerCase().split(' ');
  for (var i = 0; i < separateWord.length; i++) {
     separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
     separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}



function Planner() {

  const location = useLocation()
  const classes = useStyles()

  const [ major, setMajor ] = useState(
    "computer science")

  const [ specialisation, setSpecialisation ] = useState("")

  const [ plan, setPlan ] = useState(
    (location.state && location.state.plan) ||
    JSON.parse(localStorage.getItem('studyPlan')) || 
  {
    major: "",
    y1s1: [],
    y1s2: [],
    y2s1: [],
    y2s2: [],
    y3s1: [],
    y3s2: [],
    y4s1: [],
    y4s2: [],
  })

  const [ totalMCs, setTotalMCs] = useState(0)
  const [ submitDialogOpen, setSubmitDialogOpen ] = useState(false)
  const [ submitStatus, setSubmitStatus ] = useState({}) // whether submitted plan was valid

  const [ prereqCheck, setPrereqCheck ] = useState(false)
  const [ prereq, setPrereq ] = useState({})

  // State on checked status
  const [ checked, setChecked ] = useState(false)
  const [ checkCore, setCheckCore ] = useState({})
  const [ checkMC, setCheckMC ] = useState(false)
  const [ checkSpecialisation, setCheckSpecialisation ] = useState({})


  useEffect(() => {     
    
    localStorage.setItem('studyPlan', JSON.stringify(plan)) // Local storage to store user's study plan
    console.log(location.state)
    console.log(plan)

  }, [plan])

  function passData(semester, mods, mcs, add) {
    const modsToAdd = {}
    modsToAdd[semester] = mods
    setPlan((prevState) => {
      let merged = {...prevState, ...modsToAdd}
      return merged
    })
    if (add) {
      setTotalMCs((prevState) => prevState + mcs)
    } else {
      setTotalMCs((prevState) => prevState - mcs)
    }
  }

  function planIsEmpty() {
    return plan.y1s1.length === 0 
      && plan.y1s1.length === 0
      && plan.y1s2.length === 0
      && plan.y2s1.length === 0
      && plan.y2s2.length === 0
      && plan.y3s1.length === 0
      && plan.y3s2.length === 0
      && plan.y4s1.length === 0
      && plan.y4s2.length === 0
  }

  function handleMajorChange(event) {
    setPrereqCheck(false)
    setMajor(event.target.value)
    setSpecialisation("")
  }

  function handleSpecialisationChange(event) {
    setPrereqCheck(false)
    setSpecialisation(event.target.value)
  }

  async function submitForm(event) {
    event.preventDefault()
    setSubmitDialogOpen(true)
    let res
    if (specialisation !== "") {
      res = await axios.post('/', null, { params: {
        ...plan,
        major: major,
        specialisation: specialisation
      }})
    } else {
      res = await axios.post('/', null, { params: {
        ...plan,
        major: major
      }})
    }

    console.log(res)
    setSubmitStatus(res)
        
  }

  async function checkForm(event) {
    event.preventDefault()
    
    let res
    if (specialisation !== "") {
      res = await axios.get('/check', {
        params: {
          ...plan,
          major: major,
          specialisation: specialisation,
          totalmc: totalMCs
        }
      })
      
    } else {
      res = await axios.get('/check', {
        params: {
        ...plan,
        major: major,
        totalmc: totalMCs
        }
      })
    }
    console.log(res)

    if (specialisation !== "") {
      console.log(specialisation)
      setCheckSpecialisation(prevState => ({...prevState, specialisation: specialisation}))
    }
    if (res.data.set1) {
      setCheckSpecialisation(prevState => ({...prevState, set1: res.data.set1}))
    }
    if (res.data.set2) {
      setCheckSpecialisation(prevState => ({...prevState, set2: res.data.set2}))
    }
    console.log('specialisation', checkSpecialisation)

    if (!checked) {
      setChecked(true)
    } else {
      setChecked(false)
    }
    setPrereqCheck(false)
    setCheckCore(res.data.core)
    setCheckMC(res.data.mc)
  }

  async function getPrereq(event) {
    event.preventDefault()
    if (!prereqCheck) {
      setPrereqCheck(true)
    } else {
      setPrereqCheck(false)
    }
    setChecked(false)
    let res
    if (specialisation !== "") {
      res = await axios.get('/modules', {
        params: {
          major: major,
          specialisation: specialisation
        }
      })
    } else {
      res = await axios.get('/modules', {
        params: {
          major: major
        }
      })
    }
    setPrereq(res)
  }

  return (
    <Container>
      <Heading>
        <h2 class="header">Module Planner</h2>
        <form>
          <Major>
            <span>MAJOR: </span>
            <select
              className="form-select form-select-sm"
              name="major"
              id="major"
              value={major}
              onChange={handleMajorChange}
              required
            >
              <option value="computer science">Computer Science</option>
              <option value="business analytics">Business Analytics</option>
              <option value="information systems">Information Systems</option>
              <option value="information security">Information Security</option>
            </select>
          </Major>

          <Specialisation>
            <span>SPECIALISATION: </span>
            <select
              className="form-select form-select-sm"
              name="specialisation"
              id="specialisation"
              value={specialisation}
              onChange={handleSpecialisationChange}
              disabled={major === "information security"}
            >
              {showSpecialisations(major)}
            </select>
          </Specialisation>

          <SubmitButton type="submit" onClick={submitForm}>
            SUBMIT
          </SubmitButton>
          <CheckButton
            type="submit"
            disabled={planIsEmpty()}
            onClick={checkForm}
          >
            CHECK
          </CheckButton>
          <PrereqButton onClick={getPrereq}>Show Prerequisities</PrereqButton>
        </form>
      </Heading>

      <Dialog
        open={submitDialogOpen}
        onClose={(e) => setSubmitDialogOpen(false)}
      >
        {"data" in submitStatus && submitStatus.data.pass ? (
          <DialogTitle>Plan was Successfully Submitted!</DialogTitle>
        ) : "data" in submitStatus && !submitStatus.data.pass ? (
          <>
            <DialogTitle>
              Oops... your plan did not meet certain requirements!
            </DialogTitle>
            <DialogContent>
              {submitStatus.data.core.mod.length > 0 ? (
                <>
                  <h5>Core Modules Not Fulfilled: </h5>
                  <ul>
                    {submitStatus.data.core.mod.map((mod) => (
                      <li>{mod.toUpperCase()}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <span></span>
              )}
              {submitStatus.data.mc === false ? (
                <h5>Insufficient Modular Credits</h5>
              ) : (
                <span></span>
              )}
            </DialogContent>
          </>
        ) : (
          <span></span>
        )}
      </Dialog>

      <PlannerInterface>
        <Grid container spacing={3}>
          <GridStyled item xs={2}>
            <h3>Y1</h3>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y1s1"} func={passData} mods={plan.y1s1} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y1s2"} func={passData} mods={plan.y1s2} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={2}>
            <h3>Y2</h3>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y2s1"} func={passData} mods={plan.y2s1} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y2s2"} func={passData} mods={plan.y2s2} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={2}>
            <h3>Y3</h3>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y3s1"} func={passData} mods={plan.y3s1} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y3s2"} func={passData} mods={plan.y3s2} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={2}>
            <h3>Y4</h3>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y4s1"} func={passData} mods={plan.y4s1} />
            </PaperStyled>
          </GridStyled>
          <GridStyled item xs={5}>
            <PaperStyled className={classes.tealPaper} elevation={2}>
              <Semester id={"y4s2"} func={passData} mods={plan.y4s2} />
            </PaperStyled>
          </GridStyled>
        </Grid>
        {prereqCheck ? (
          <Prereq>
            <PrereqHeading>
              <h5>
                Prerequisites for{" "}
                <span style={{ color: "#94d6ff" }}>
                  {capitalizeFirstLetterOfEachWord(major)}
                </span>
                {specialisation !== "" ? (
                  <span style={{ color: "#94d6ff" }}>
                    , {capitalizeFirstLetterOfEachWord(specialisation)}
                  </span>
                ) : (
                  <span></span>
                )}
              </h5>
              <IconButton
                className={classes.closeCheckButton}
                onClick={(e) => setPrereqCheck(false)}
              >
                <CloseIcon style={{ fill: "#bebebe" }} />
              </IconButton>
            </PrereqHeading>
            <br />
            <PrereqContent>
              {"data" in prereq && "core" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>Core Modules:</h6>
                  <Grid container spacing={1}>
                    {prereq.data.core.map((coreMod) => (
                      <Grid item xs={3}>
                        <span style={{ fontSize: 15 }}>
                          {coreMod.toUpperCase()}
                        </span>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <span></span>
              )}{" "}
              <br />
              {"data" in prereq && "set1" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>
                    Set 1 Modules (Select Any 2):
                  </h6>
                  <Grid container spacing={1}>
                    {prereq.data.set1.map((coreMod) => (
                      <Grid item xs={3}>
                        <span style={{fontSize: 15}}>
                          {coreMod.toUpperCase()}
                        </span>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <span></span>
              )}{" "}
              <br />
              {"data" in prereq && "set2" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>
                    Set 2 Modules (Select Any 3):
                  </h6>
                  <Grid container spacing={1}>
                    {prereq.data.set2.map((coreMod) => (
                      <Grid item xs={3}>
                        <span style={{fontSize: 15}}>
                          {coreMod.toUpperCase()}
                        </span>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <span></span>
              )}
            </PrereqContent>
          </Prereq>
        ) : (
          <span></span>
        )}

        {checked ? (
          <Prereq>
            <PrereqHeading>
              <h5>Check Results</h5>
              <IconButton
                className={classes.closeCheckButton}
                onClick={(e) => setChecked(false)}
              >
                <CloseIcon style={{ fill: "#bebebe" }} />
              </IconButton>
            </PrereqHeading>
            <PrereqContent>
              <br />
              <CheckResults>
                <div class="left">
                  <h6 style={{ color: "#94d6ff" }}>Plan is Valid:</h6>
                </div>
                <div class="right">
                  {checkMC && checkCore ? (
                    <CheckCircleIcon style={{ fill: "green" }} />
                  ) : (
                    <CancelIcon style={{ fill: "#d45550" }} />
                  )}
                </div>
                
                
              </CheckResults>
              <br />
              <CheckResults>
                <div class="left">
                  <h6 style={{ color: "#94d6ff" }}>MCs are Fulfilled:</h6>
                </div>
                <div class="right">
                  {checkMC ? (
                    <CheckCircleIcon style={{ fill: "green" }} />
                  ) : (
                    <CancelIcon style={{ fill: "#d45550" }} />
                  )}
                </div>
                
               
              </CheckResults>
              <br />
              <CheckResults>
                <div class="left">
                  <h6 style={{ color: "#94d6ff" }}>Core Modules Fulfilled:</h6>
                </div>
                <div class="right">
                  {checkCore.pass ? (
                    <CheckCircleIcon style={{ fill: "green" }} />
                  ) : (
                    <CancelIcon style={{ fill: "#d45550" }} />
                  )}
                </div>
                
                
              </CheckResults>
              {!checkCore.pass ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>Core Modules Yet To Take:</h6>
                  <Grid container spacing={1}>
                    {checkCore.mod ? (
                      checkCore.mod.map((x) => (
                        <Grid item spacing={3}>
                          <span style={{fontSize: 15}}>
                            {x.toUpperCase()}
                          </span>
                          
                        </Grid>
                      ))
                    ) : (
                      <span></span>
                    )}
                  </Grid>
                </div>
              ) : (
                <span></span>
              )}
              {checkSpecialisation.set1 ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Set 1 Modules Satisfied (select any 2):{" "}
                  </h6>
                  {checkSpecialisation.set1.mod.length > 0 ? (
                    <Grid container spacing={1}>
                      {checkSpecialisation.set1.mod.map((x) => (
                        <Grid item xs={3}>
                          <span style={{fontSize: 15}}>
                            {x.toUpperCase()}
                          </span>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              ) : (
                <span></span>
              )}
              {checkSpecialisation.set2 ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Set 2 Modules Satisfied (select any 3):{" "}
                  </h6>
                  {checkSpecialisation.set2.mod.length > 0 ? (
                    <Grid container spacing={1}>
                      {checkSpecialisation.set2.mod.map((x) => (
                        <Grid item xs={3}>
                          <span style={{fontSize: 15}}>
                            {x.toUpperCase()}
                          </span>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              ) : (
                <span></span>
              )}
            </PrereqContent>
          </Prereq>
        ) : (
          <span></span>
        )}
      </PlannerInterface>
    </Container>
  );
}

const Container = styled.div `
  height: 100%;    
  min-height: calc(100vh - 60px);
  width: 100%;
`
const PaperStyled = styled(Paper) `
  min-height: 150px;
  min-width: 200px;
  height: 100%;
`
const PlannerInterface = styled.div `
  display: flex;
`
const GridStyled = styled(Grid)`
  h3 {
    margin-top: 22%;
    font-weight: 10;
    text-align: center;
  }
`
const Heading = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 70px;
  
    h2 {
      white-space: nowrap;
      margin-top: auto;
      margin-bottom: 2px;
      margin-right: 5%;
    }

    form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 70%;
        font-size: 14px;
        letter-spacing: 1px;

        select {
          font-size: 13px;
        }

    }
`
const Major = styled.div `
  display: flex;
  width: 30%;
  align-items: center;
  margin-right: 3%;
  span {
      margin-right: 2%;
  }
`
const CheckResults = styled.div `
  display: flex;
  .left {

  }
  .right {
    margin-right: 0;
    margin-left: auto;
  }
`
const Specialisation = styled.div `
  display: flex;
  width: 35%;
  align-items: center;
  margin-right: 5%;
  span {
      margin-right: 2%;
  }
`
const SubmitButton = styled.button `
  background: #0288d1;
  border: none;
  color: white;
  padding: 6px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.1px;
  margin-right: 15px;

  &:hover {
    background: #0277bd;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }

  :disabled {
    opacity: 50%;
    pointer-events: none;
  }

`
const PrereqButton = styled.button `
  background: none;
  border: none;
  white-space: nowrap;
  color: #6bc6ff;
  font-size: 15px;

  &:hover {
    color: #94d6ff;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`
const Prereq = styled.div `
  width: 35%;
  background: #001c24;
  margin-left: 1.3%;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 20% ) 0px 20px 30px 10px;
  transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;

`
const PrereqHeading = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
  padding-top: 3%;
  margin: 0 auto;
  h5 {
    white-space: normal;
    font-size: 16px;
    line-height: 1.5;
  }
`
const PrereqContent = styled.div `
  width: 90%;
  margin: 0 auto;
`
const CheckButton = styled.button `
  background: #388e3c;
  border: none;
  color: white;
  padding: 6px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 200;
  letter-spacing: 1.5px;
  margin-left: 15px;
  margin-right: 45px;

  &:hover {
    background: #4caf50;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }

  :disabled {
    opacity: 50%;
    pointer-events: none;
  }
`


export default Planner
