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

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: '#00766c'
  },
  creamPaper: {
    backgroundColor: '3358ff',
    opacity: '0.9'
  }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

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

function handleScroll() { // scroll to bottom 
  window.scroll({
    top: document.body.offsetHeight,
    left: 0, 
    behavior: 'smooth',
  });
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

  const classes = useStyles()

  const [ major, setMajor ] = useState("computer science")
  const [ specialisation, setSpecialisation ] = useState("")
  const [ plan, setPlan ] = useState(JSON.parse(localStorage.getItem('studyPlan')) || {
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
  const [ dialogOpen, setDialogOpen] = useState(false)
  const [ prereq, setPrereq ] = useState({})

  // State on checked status
  const [ checked, setChecked ] = useState(false)
  const [ checkCore, setCheckCore ] = useState(false)
  const [ checkMC, setCheckMC ] = useState(false)
  const [ checkSpecialisation, setCheckSpecialisation ] = useState({})

  useEffect(() => { // Local storage to store user's study plan
    localStorage.setItem('studyPlan', JSON.stringify(plan))
    console.log(localStorage.getItem('studyPlan'))
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

  function changeMajor(major) {
    setMajor(major)
    setSpecialisation("")
  }

  async function submitForm(event) {
    event.preventDefault()
    let res
    if (specialisation !== "") {
      res = await axios.post('/', {
        ...plan,
        major: major,
        specialisation: specialisation
      })
    } else {
      res = await axios.post('/', {
        ...plan,
        major: major
      })
    }

    setMajor("computer science")
    setSpecialisation("")
    setPlan({})
    
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

    setChecked(true)
    setCheckCore(res.data.core)
    setCheckMC(res.data.mc)
    handleScroll()  
  }

  async function getPrereq(event) {
    event.preventDefault()
    setDialogOpen(true)
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
              onChange={(e) => changeMajor(e.target.value)}
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
            onChange={e => setSpecialisation(e.target.value)}
            disabled={major === 'information security'}>
              {showSpecialisations(major)}
            </select>
          </Specialisation>

          <SubmitButton type="submit" onClick={submitForm}>
            SUBMIT
          </SubmitButton>
          <CheckButton type="submit"  onClick={checkForm}>
            CHECK
          </CheckButton>
          <PrereqButton onClick={getPrereq}>
            Show Prerequisities >
          </PrereqButton>
        </form>
      </Heading>

      <Dialog open={dialogOpen} onClose={e => setDialogOpen(false)} PaperProps={{style: {backgroundColor: "#ffffff"}}} TransitionComponent={Transition}>
        <DialogTitle>Prerequisites for <span style={{color: '#02669c'}}><b>{capitalizeFirstLetterOfEachWord(major)}</b></span>{specialisation !== "" ? <span style={{color: '#02669c'}}>, <b>{capitalizeFirstLetterOfEachWord(specialisation)}</b></span> : <span></span>}</DialogTitle>
        <DialogContent>

          {
            "data" in prereq && "core" in prereq.data ? 
            <div>
              <h5> Core Modules: </h5> 
              <Grid container spacing={1}>
                {prereq.data.core.map(coreMod => <Grid item xs={3}>{coreMod.toUpperCase()}</Grid>)}
              </Grid>
            </div>
            : <span></span>
          }
          <br/>
          {
           "data" in prereq && "set1" in prereq.data ? 
            <div>
              <h5>Set 1 Modules (Select Any 2): </h5> 
              <Grid container spacing={1}>
                {prereq.data.set1.map(coreMod => <Grid item xs={3}>{coreMod.toUpperCase()}</Grid>)}
              </Grid>
            </div> 
            : <span></span>
          }
          <br/>
          {
            "data" in prereq && "set2" in prereq.data ? 
            <div>
              <h5>Set 2 Modules (Select Any 3): </h5> 
              <Grid container spacing={1}>
                {prereq.data.set2.map(coreMod => <Grid item xs={3}>{coreMod.toUpperCase()}</Grid>)}
              </Grid>
            </div> 
            : <span></span>
          }
          <br/>
        </DialogContent>
      </Dialog>

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
            <Semester id={"y2s2"} func={passData} mods={plan.y2s2}/>
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
            <Semester id={"y3s2"} func={passData} mods={plan.y3s2}/>
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y4</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y4s1"} func={passData} mods={plan.y4s1}/>
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y4s2"} func={passData} mods={plan.y4s2}/>
          </PaperStyled>
        </GridStyled>
      </Grid>
      <Grid container spacing={3} style={{marginTop: '3%', marginBottom: '3%'}}>
        <GridStyled item xs={4}>
        </GridStyled>
        <GridStyledCheck item xs={6}>

              {
                checked ? 

                  <StyledCheck>
                    <CloseButton onClick={e => setChecked(false)}><CloseIcon style={{fill: "#8cecf0"}} /></CloseButton>
                    <h3 class="header" style={{textDecoration: "underline", textDecorationColor: "#8cecf0", textUnderlineOffset: "6px", textAlign: "center"}}>Check Results</h3><br/>
                    <div class="results"><span class="left">Plan is Valid:</span> <span class="right">{ checkMC && checkCore ? <CheckCircleIcon style={{fill: "green"}} /> : <CancelIcon style={{fill: "#d45550"}} /> }</span></div><br/>
                    <div class="results"><span class="left">MCs are fulfilled:</span> <span class="right">{ checkMC ? <CheckCircleIcon style={{fill: "green"}} /> : <CancelIcon style={{fill: "#d45550"}} /> }</span></div><br/>
                    <div class="results"><span class="left">Core Modules are fulfilled:</span> <span class="right">{ checkCore ? <CheckCircleIcon style={{fill: "green"}} /> : <CancelIcon style={{fill: "#d45550"}} /> }</span> </div><br/>
                    {
                      (specialisation !== "" && Object.keys(checkSpecialisation).length > 0) 
                        ? <div>
                            <div class="results"><span class="left">Specialisation fulfilled:</span> 
                              <span class="right">{Object.keys(checkSpecialisation)
                                                    .every((key) => checkSpecialisation[key].hasOwnProperty("pass") ? checkSpecialisation[key].pass === true : true) ? <CheckCircleIcon style={{fill: "green"}} /> : <CancelIcon style={{fill: "#d45550"}} />}
                              </span>
                            </div><br/>

                              <div class="modList">
                              {
                                checkSpecialisation.set1 ? 
                                  <span class="left">Set 1 Modules Satisfied (select any 2): &nbsp;&nbsp; { checkSpecialisation.set1.mod.length > 0 ? <ul>{checkSpecialisation.set1.mod.map(mod => <li>{mod.toUpperCase()}</li>)}</ul> : <span>-</span> } </span> : <span></span>
                              }
                            </div>
                            <div class="modList">
                              {
                                checkSpecialisation.set2 ?
                                <span class="left">Set 2 Modules Satisfied (select any 3): &nbsp;&nbsp; { checkSpecialisation.set2.mod.length > 0 ? <ul>{checkSpecialisation.set2.mod.map(mod => <li>{mod.toUpperCase()}</li>)}</ul> : <span>-</span> } </span> : <span></span>
                              }
                            </div>
                            
                          </div>
                        : <div></div>
                    }
                  </StyledCheck>

                : <div></div>
              }       

        </GridStyledCheck>
        <GridStyled item xs={2}>
        </GridStyled>
      </Grid>
      
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
const StyledCheck = styled.div `
  min-height: 150px;
  height: 100%;
  padding: 30px 20px;
  background: #001c24;
  box-shadow: rgb(0 0 0 / 26% ) 0px 20px 30px 10px;
  border-radius: 15px;

  .results {
        width: 300px;
        display: flex;
        margin: 0 auto;
      }

  .left {
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Mulish', 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  }

  .right {
    margin-right: 0;
    margin-left: auto;
  }

  .modList {
    width: 300px;
    margin: 0 auto;
    
    ul li {
      display: inline;
      margin: 0 5px;
    }
  }
`
const GridStyled = styled(Grid)`
  h3 {
    margin-top: 22%;
    font-weight: 10;
    text-align: center;
  }
`
const GridStyledCheck = styled(Grid) `
  margin-top: 5%;
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

const CloseButton = styled(IconButton) `
  float: right;
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
// const CheckResults = styled.div  `
//   margin-top: 6%;
//   margin-left: 40%;

//   .results {
//     width: 300px;
//     display: flex;
//   }

//   .left {
//     font-size: 16px;
//     font-weight: 100;
//   }

//   .right {
//     margin-right: 0;
//     margin-left: auto;
//   }

//   .modList {
    
//     ul li {
//       display: inline;
//       margin: 0 5px;
//     }
//   }

// `

export default Planner
