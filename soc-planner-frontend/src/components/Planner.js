import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Semester from './Semester'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles, IconButton, Button, Popper, Fade, ClickAwayListener } from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ImageIcon from '@material-ui/icons/Image'
import CancelIcon from '@material-ui/icons/Cancel'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import axios from '../dbAxios'
import { useLocation } from 'react-router-dom'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { planIsEmpty } from './utils/utils'
import domtoimage from 'dom-to-image'
import { useSelector } from 'react-redux'
import { selectLogin } from '../features/login/loginSlice'

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: '#00766c'
  },
  closeCheckButton: {
    backgroundColor: '#001c24',
    color: '#C8C8C8',
    float: 'right',
    '&:hover': {
      backgroundColor: '#2e4248',
      color: '#c8c8c8'
    }
  },
  saveImageButton: {
    backgroundColor: '#002b36',
    padding: '5px 12px',
    fontSize: '13px',
    letterSpacing: '1px',
    boxShadow: 'none',
    border: '1px solid #6bc6ff',
    color: '#6bc6ff',
    '&:hover': {
      color: '#8cecf0',
      backgroundColor: '#002b36',
      border: '1px solid #8cecf0'
    }
  },
  typography: {
    padding: theme.spacing(2)
  }
}))

const specialisations = {
  'computer science': [
    {name: "Artificial Intelligence", value: "artificial intelligence"},
    {name: "Algorithms and Theory", value: "algorithms and theory"},
    {name: "Computer Graphics and Games", value: "computer graphics and games"},
    {name: "Computer Security", value: "computer security"},
    {name: "Database Systems", value: "database systems"},
    {name: "Multimedia Information Retrieval", value: "multimedia information retrieval"},
    {name: "Networking and Distributed Systems", value: "networking and distributed systems"},
    {name:  "Parallel Computing", value: "parallel computing"},
    {name: "Programming Languages", value: "programming languages"},
    {name: "Software Engineering", value: "software engineering"},
  ],
  'business analytics': [
    {name: "General", value: ""},
    {name: "Financial Analytics", value: "financial analytics"},
    {name: "Marketing Analytics", value: "marketing analytics"}
  ], 
  'information systems': [
    {name: "General", value: ""},
    {name: "Digital Innovation", value: "digital innovation"},
    {name: "Electronic Commerce", value: "electronic commerce"},
    {name: "Financial Technology", value: "financial technology"}
  ], 
  'information security': [
    {name: "General", value: ""},
  ]
}

function showSpecialisations(major) {
  return (
    <>
    { specialisations[major].map(x => (
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

  const [ major, setMajor ] = useState("computer science")

  const [ specialisation, setSpecialisation ] = useState("artificial intelligence")

  const [ anchorEl, setAnchorEl ] = useState(null)

  const open = Boolean(anchorEl)
  const id = open ? 'transitions-popover' : undefined

  const [ plan, setPlan ] = useState(
    (location.state && location.state.plan) ||
    JSON.parse(localStorage.getItem('studyPlan')) || 
  {
    major: "",
    specialisation: "",
    y1s1: [],
    y1s2: [],
    y2s1: [],
    y2s2: [],
    y3s1: [],
    y3s2: [],
    y4s1: [],
    y4s2: [],
  })

  const [ mcs, setMCs] = useState({
    y1s1: 0,
    y1s2: 0,
    y2s1: 0,
    y2s2: 0,
    y3s1: 0,
    y3s2: 0,
    y4s1: 0,
    y4s2: 0,
  })

  const [ modules, setModules] = useState({
    y1s1: 0,
    y1s2: 0,
    y2s1: 0,
    y2s2: 0,
    y3s1: 0,
    y3s2: 0,
    y4s1: 0,
    y4s2: 0,
  })

  const [ totalMCs, setTotalMCs ] = useState(0) 
  const [ totalModules, setTotalModules ] = useState(0)

  const [ submitDialogOpen, setSubmitDialogOpen ] = useState(false)
  const [ submitStatus, setSubmitStatus ] = useState(false) // whether submitted plan was valid

  const [ prereqCheck, setPrereqCheck ] = useState(false)
  const [ prereq, setPrereq ] = useState({})

  // State on checked status
  const [ checked, setChecked ] = useState(false) // if plan is being checked
  const [ checkCore, setCheckCore ] = useState({}) // if core mods pass
  const [ checkMC, setCheckMC ] = useState(false) // if mcs are fulfilled
  const [ checkElective, setCheckElective ] = useState({}) // result of elective (for bza, infosys)
  const [ checkSpecialisation, setCheckSpecialisation ] = useState({}) // result of specialisation/focus area


  useEffect(() => {     
    localStorage.setItem('studyPlan', JSON.stringify(plan)) // Local storage to store user's study plan
  }, [plan])

  useEffect(() => { // removes object id from imported plan
    if (plan._id) {
      let planCopy = plan
      delete planCopy._id
      setPlan(planCopy)
    }
  }, [])

  useDeepCompareEffect(() => {
    let sum = 0
    for (const property in mcs) {
      sum = sum + mcs[property]
    }    
    setTotalMCs(sum)
  
  }, [mcs])

  useDeepCompareEffect(() => {
    let sum = 0
    for (const property in modules) {
      sum = sum + modules[property]
    }
    setTotalModules(sum)
  }, [modules])


  function passData(semester, mods, mcs) {
    setPlan((prevState) => {
      let updated = {...prevState}
      updated[semester] = mods
      return updated
    })

    setMCs((prevState) => {
      let updated = {...prevState}
      updated[semester] = mcs
      return updated
    })

    setModules((prevState) => {
      let updated = {...prevState}
      updated[semester] = mods.length
      return updated
    })
  }

  function handleMajorChange(event) {
    setPrereqCheck(false)
    setChecked(false)
    setCheckElective({})
    setMajor(event.target.value)
    setPlan(plan.major = event.target.value)
    if (event.target.value === "computer science") {
      setSpecialisation("artificial intelligence")
      const updatedPlan = plan
      updatedPlan.specialisation = "artificial intelligence"
      setPlan(updatedPlan)
    } else {
      setSpecialisation("")
      const updatedPlan = plan
      delete updatedPlan.specialisation
      setPlan(updatedPlan)
    }
  }

  function handleSpecialisationChange(event) {
    setPrereqCheck(false)
    setChecked(false)
    setSpecialisation(event.target.value)
    const updatedPlan = plan
    if (event.target.value !== "") {
      updatedPlan.specialisation = event.target.value
    } else {
      delete updatedPlan.specialisation
    }
    setPlan(updatedPlan)
  }

  function handlePopperClick(event) {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  function saveScreenshot() {
    var planner = document.getElementById('capture')
    domtoimage.toPng(planner).then(dataUrl => {
      var link = document.createElement('a')
      link.download = 'study-plan.jpeg'
      link.href = dataUrl
      link.click()
    })
  }

  async function submitForm(event) {
    event.preventDefault()

    setSubmitDialogOpen(true)
    let res
    if (specialisation !== "") {
      res = await axios.post('/', null, { params: {
        ...plan,
        major: major,
        specialisation: specialisation,
        totalmc: totalMCs
      }})
      console.log(res)
    } else {
      res = await axios.post('/', null, { params: {
        ...plan,
        major: major,
        totalmc: totalMCs
      }})
      console.log(res)
    }

    setSubmitStatus(res.data)
  }

  async function checkForm(event) {
    event.preventDefault()
    if (!checked) {
      setChecked(true)
    } else {
      setChecked(false)
    }

    if (prereqCheck) {
      setPrereqCheck(false)
    }
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

    if (res.data.elective) {
      setCheckElective(prevState => ({...prevState, elective: res.data.elective}))
    } else {
      let updatedCheckElective = checkElective
      delete checkElective.elective
      setCheckElective(prevState => updatedCheckElective)
    }

    // conditions to update check results for specialisation

    let updateCheckSpecialisation = {}

    if (specialisation !== "") {
      updateCheckSpecialisation.specialisation = specialisation
    }

    if (res.data.set1) {
      updateCheckSpecialisation.set1 = res.data.set1
    }

    if (res.data.set2) {
      updateCheckSpecialisation.set2 = res.data.set2
    }

    if (res.data.focus) {
      updateCheckSpecialisation.focus = res.data.focus
    }

    setCheckSpecialisation(updateCheckSpecialisation)

    setPrereqCheck(false)
    setCheckCore(res.data.core)
    setCheckMC(res.data.mc)
    console.log(res)
  }

  async function getPrereq(event) {
    event.preventDefault()

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
    if (!prereqCheck) {
      setPrereqCheck(true)
    } else {
      setPrereqCheck(false)
    }
    
    
  }

  return (
    <Container>
      <Heading>
        <h2 class="header" data-testid="planner_header">
          Module Planner
        </h2>
        <form>
          <Major>
            <span>MAJOR: </span>
            <select
              className="form-select form-select-sm"
              name="major"
              id="major"
              data-testid="planner_major"
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
              data-testid="planner_specialisation"
              value={specialisation}
              onChange={handleSpecialisationChange}
              disabled={major === "information security"}
            >
              {showSpecialisations(major)}
            </select>
          </Specialisation>

          {
            useSelector(selectLogin) ?
            <SubmitButton
              data-testid="planner_submitButton"
              type="submit"
              onClick={submitForm}
            >
              SUBMIT
            </SubmitButton>
            :
            <SubmitButton
              type="button"
              aria-describedby={id} 
              onClick={handlePopperClick}
              >
              SUBMIT
            </SubmitButton>
          }
          
          
            <Popper
              id={id}
              open={open}
              anchorEl={anchorEl}
              placement={'bottom-start'}
              transition
            >
              {({ TransitionProps }) => (
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper elevation={2}>
                      <PopperText>
                        <div style={{fontWeight: 700, marginBottom: '5px'}}>Want to submit a study plan?</div>
                        <div>Log in or sign up for an account.</div>
                      </PopperText>
                    </Paper>
                    
                  </Fade>
                </ClickAwayListener>
              )}
            </Popper>
          
          

          


          <CheckButton
            type="submit"
            data-testid="planner_checkButton"
            disabled={planIsEmpty(plan)}
            onClick={checkForm}
          >
            CHECK
          </CheckButton>
          <PrereqButton data-testid="planner_prereqButton" onClick={getPrereq}>
            Show Prerequisites
          </PrereqButton>
        </form>
      </Heading>

      <Dialog
        open={submitDialogOpen}
        onClose={(e) => setSubmitDialogOpen(false)}
      >
        {submitStatus === true ? (
          <DialogTitle data-testid="planner_submitDialog">
            Plan was Successfully Submitted!
          </DialogTitle>
        ) : (
          <>
            <DialogTitle data-testid="planner_submitDialog">
              Oops... your plan did not meet certain requirements! ☹
            </DialogTitle>
            <DialogContent>
              Check Your Plan To Make Sure All Criteria Are Fulfilled.
            </DialogContent>
          </>
        )}
        <br />
      </Dialog>

      <PlanInfo>
        <Grid container spacing={3}>
          <Grid item xs={2}></Grid>
          <GridInfo item xs={10}>
            <div>
              {<InfoSpan>{totalMCs} MCs</InfoSpan>}
              &nbsp;&nbsp;&nbsp;
              {<InfoSpan>{totalModules} modules taken</InfoSpan>}
            </div>

            <Button 
              variant="contained" 
              className={classes.saveImageButton} 
              startIcon={<ImageIcon />}
              onClick={(event) => saveScreenshot()}
              >
                DOWNLOAD
              </Button>
          </GridInfo>
        </Grid>
      </PlanInfo>

      <PlannerInterface id="capture">
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
          <Prereq data-testid="planner_prereqSection">
            <PrereqHeading>
              <h5>
                Prerequisites for{" "}
                <span
                  style={{ color: "#94d6ff" }}
                  data-testid="planner_prereqMajor"
                >
                  {capitalizeFirstLetterOfEachWord(major)}
                </span>
                {specialisation !== "" ? (
                  <span
                    style={{ color: "#94d6ff" }}
                    data-testid="planner_prereqSpecialisation"
                  >
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
            </PrereqContent>
            <br />
            <PrereqContent>
              {"data" in prereq && "elective" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>Electives:</h6>
                  {major === "business analytics" ? ( // if major is business analytics
                    <div>
                      <h7>
                        <b>List A:</b>
                      </h7>
                      <Grid container spacing={1}>
                        {prereq.data.elective.lista.map((coreMod) => (
                          <Grid item xs={3}>
                            {coreMod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                      <br />
                      <h7>
                        <b>List B:</b>
                      </h7>
                      <Grid container spacing={1}>
                        {prereq.data.elective.listb.map((coreMod) => (
                          <Grid item xs={3}>
                            {coreMod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                      <br />
                      <h7>
                        <b>List C:</b>
                      </h7>
                      <Grid container spacing={1}>
                        {prereq.data.elective.listc.map((coreMod) => (
                          <Grid item xs={3}>
                            {coreMod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                      <br />
                    </div>
                  ) : major === "computer science" ? ( // else if major is computer science
                    <div>
                      <h7>
                        <b>Primaries:</b>
                      </h7>
                      <Grid container spacing={1}>
                        {prereq.data.elective.primary.map((mod) => (
                          <Grid item xs={3}>
                            {mod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                      <br />
                      <h7>
                        <b>Electives:</b>
                      </h7>
                      <Grid container spacing={1}>
                        {prereq.data.elective.electives.map((mod) => (
                          <Grid item xs={3}>
                            {mod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  ) : (
                    <div>
                      <Grid container spacing={1}>
                        {prereq.data.elective.map((coreMod) => (
                          <Grid item xs={3}>
                            {coreMod.toUpperCase()}
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  )}
                </div>
              ) : (
                <span></span>
              )}
            </PrereqContent>
            <br />
            <PrereqContent>
              {"data" in prereq && "set1" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>
                    Specialisation Set 1 Modules (Select 2):
                  </h6>
                  <Grid container spacing={1}>
                    {prereq.data.set1.map((coreMod) => (
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
              {"data" in prereq && "set2" in prereq.data ? (
                <div>
                  <h6 style={{ color: "#94d6ff" }}>
                    Specialisation Set 2 Modules (Select 3):
                  </h6>
                  <Grid container spacing={1}>
                    {prereq.data.set2.map((coreMod) => (
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

              <br />

              {"elective" in checkElective ? (
                <CheckResults>
                  <div class="left">
                    <h6 style={{ color: "#94d6ff" }}>Elective Fulfilled:</h6>
                  </div>
                  <div class="right">
                    {checkElective.elective.pass ? (
                      <CheckCircleIcon style={{ fill: "green" }} />
                    ) : (
                      <CancelIcon style={{ fill: "#d45550" }} />
                    )}
                  </div>
                </CheckResults>
              ) : (
                <span></span>
              )}

              {"focus" in checkSpecialisation ? (
                <CheckResults>
                  <div class="left">
                    <h6 style={{ color: "#94d6ff" }}>Focus Area Fulfilled:</h6>
                  </div>
                  <div class="right">
                    {checkSpecialisation.focus.pass ? (
                      <CheckCircleIcon style={{ fill: "green" }} />
                    ) : (
                      <CancelIcon style={{ fill: "#d45550" }} />
                    )}
                  </div>
                </CheckResults>
              ) : (
                <span></span>
              )}

              {!checkCore.pass ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Core Modules Yet To Take:
                  </h6>
                  {checkCore.mod ? (
                    <Grid container spacing={1}>
                      {checkCore.mod.map((mod) => (
                        <Grid item xs={3}>
                          <span style={{ fontSize: 15 }}>
                            {mod.toUpperCase()}
                          </span>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <span></span>
                  )}
                </div>
              ) : (
                <span></span>
              )}
              {"focus" in checkSpecialisation ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Focus Area Modules Satisfied:{" "}
                  </h6>
                  {checkSpecialisation.focus.mod.length > 0 ? (
                    <Grid container spacing={1}>
                      {checkSpecialisation.focus.mod.map((mod) => (
                        <Grid item xs={3}>
                          <span style={{ fontSize: 15 }}>
                            {mod.toUpperCase()}
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
              {"set1" in checkSpecialisation ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Specialisation Set 1 Modules Satisfied (select 2):{" "}
                  </h6>
                  {checkSpecialisation.set1.mod.length > 0 ? (
                    <Grid container spacing={1}>
                      {checkSpecialisation.set1.mod.map((x) => (
                        <Grid item xs={3}>
                          <span style={{ fontSize: 15 }}>
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
              {"set2" in checkSpecialisation ? (
                <div>
                  <br />
                  <h6 style={{ color: "#94d6ff" }}>
                    Specialisation Set 2 Modules Satisfied (select 3):{" "}
                  </h6>
                  {checkSpecialisation.set2.mod.length > 0 ? (
                    <Grid container spacing={1}>
                      {checkSpecialisation.set2.mod.map((x) => (
                        <Grid item xs={3}>
                          <span style={{ fontSize: 15 }}>
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

              {"elective" in checkElective ? (
                <div>
                  <br />

                  {major === "business analytics" ? (
                    checkElective.elective.pass ? (
                      <span></span>
                    ) : (
                      <>
                        <h6 style={{ color: "#94d6ff" }}>
                          Elective Modules Satisfied:
                        </h6>
                        <h7>
                          <b>List A:</b>
                        </h7>
                        <br />
                        {checkElective.elective.lista.mod.length > 0 ? (
                          <Grid container spacing={1}>
                            {checkElective.elective.lista.mod.map((mod) => (
                              <Grid item xs={3}>
                                {mod.toUpperCase()}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <span>-</span>
                        )}
                        <br />
                        <br />

                        <h7>
                          <b>List B:</b>
                        </h7>
                        <br />
                        {checkElective.elective.listb.mod.length > 0 ? (
                          <Grid container spacing={1}>
                            {checkElective.elective.listb.mod.map((mod) => (
                              <Grid item xs={3}>
                                {mod.toUpperCase()}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <span>-</span>
                        )}
                        <br />
                        <br />

                        <h7>
                          <b>List C:</b>
                        </h7>
                        <br />
                        {checkElective.elective.listc.mod.length > 0 ? (
                          <Grid container spacing={1}>
                            {checkElective.elective.listc.mod.map((mod) => (
                              <Grid item xs={3}>
                                {mod.toUpperCase()}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <span>-</span>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <h6 style={{ color: "#94d6ff" }}>
                        Elective Modules Satisfied:
                      </h6>
                      {checkElective.elective.hasOwnProperty("mod") &&
                      checkElective.elective.mod.length > 0 ? (
                        <Grid container spacing={1}>
                          {checkElective.elective.mod.map((mod) => (
                            <Grid item xs={3}>
                              {mod.toUpperCase()}
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <span></span>
                      )}
                    </>
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
  background-color: #002b36;
  padding: 5px 0;
`
const GridStyled = styled(Grid)`
  h3 {
    margin-top: 22%;
    font-weight: 10;
    text-align: center;
  }
`
const GridInfo = styled(Grid) `
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PopperText = styled.div `
  padding: 17px 17px;
`
const PlanInfo = styled.div `
  margin-bottom: 0.5%;
`

const InfoSpan = styled.span `
  font-size: 14px;
  color: #8cecf0;
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
  background-color: #0288d1;
  color: white;
  border: none;
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
