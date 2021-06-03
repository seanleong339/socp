import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Semester from './Semester'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import teal from "@material-ui/core/colors/teal"
import axios from '../dbAxios'

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: teal[800]
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
  ]
}

function showSpecialisations(major) {
  return (
    <>
    <option value="">General</option>
    {specialisations[major].map(x => (
      <option value="x.value">{x.name}</option>
    ))}
    </>
  )
}



function Planner() {

  const classes = useStyles()

  const [ major, setMajor ] = useState("computer science")
  const [ specialisation, setSpecialisation ] = useState("")
  const [ plan, setPlan ] = useState({})
  const [ submit, setSubmit] = useState(false)

  function passData(semester, mods) {
    const modsToAdd = {}
    modsToAdd[semester] = mods
    setPlan(prevState => {
      return {
        ...prevState,
        ...modsToAdd
      }
    })
    setSubmit(false)
  }

  function planIsEmpty(plan) {
    const res = true
    for (const key in plan) {
      if (plan.hasOwnProperty(key)) {
        if (plan[key].length > 0) {
          res = false
        }
      }
    }
    return res
  }

  async function submitForm(event) {
    event.preventDefault()
    setSubmit(true)
    setMajor("computer science")
    setSpecialisation("")
    let res
    if (planIsEmpty(plan)) {
      
    } else if (specialisation !== "") {
      res = await axios.post('/api/user', {
        ...plan,
        major: major,
        specialisation: specialisation
      })
    } else {
      res = await axios.post('/api/user', {
        ...plan,
        major: major
      })
    }
    console.log(res)
    setPlan({})
    
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
              onChange={(e) => setMajor(e.target.value)}
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
          <CheckButton>
            CHECK
          </CheckButton>
        </form>
      </Heading>

      <Grid container spacing={3}>
        <GridStyled item xs={2}>
          <h3>Y1</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y1s1"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y1s2"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y2</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y2s1"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y2s2"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y3</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y3s1"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y3s2"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y4</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y4s1"} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={"y4s2"} func={passData} submit={submit} />
          </PaperStyled>
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
        width: 60%;
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

  &:hover {
    background: #0277bd;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
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

  &:hover {
    background: #4caf50;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`

export default Planner
