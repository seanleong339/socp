import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Semester from './Semester'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import teal from "@material-ui/core/colors/teal"
import Button from '@material-ui/core/Button'
import axios from '../dbAxios'

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: teal[800]
  }
}))



function SubmitPlan() {

  const classes = useStyles()

  const [ major, setMajor ] = useState("computer science")
  const [ specialisation, setSpecialsation ] = useState("")
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

  async function submitForm(event) {
    event.preventDefault()
    setSubmit(true)
    setMajor("")
    setSpecialsation("")
    let res
    if (specialisation !== "") {
      res = axios.post('/api/user', {
        ...plan,
        major: major,
        specialisation: specialisation
      })
    } else {
      res = axios.post('/api/user', {
        ...plan,
        major: major
      })
    }
    console.log(res);
    
  }

  return (
    <Container>
      <h1>Submit A Plan</h1>
      <Grid container spacing={3}>
        <GridStyled item xs={2}>
          <h3>Y1</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y1s1'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y1s2'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y2</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y2s1'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y2s2'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y3</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y3s1'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y3s2'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}>
          <h3>Y4</h3>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y4s1'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y4s2'} func={passData} submit={submit} />
          </PaperStyled>
        </GridStyled>
      </Grid>

      <SubmitField>
        <form>
          
          <Major>
            <span>Major: </span>
            <select
              className="form-select form-select-sm"
              name="major"
              id="major"
              value={major}
              onChange={e => setMajor(e.target.value)}
              required
            >
              <option value="computer science">Computer Science</option>
              <option value="business analytics">Business Analytics</option>
              <option value="information systems">Information Systems</option>
              <option value="information security">Information Security</option>
            </select>
          </Major>

          <Specialisation>
            <span>Specialisation: </span>
            <input
              type="text"
              id="major"
              major="major"
              className="form-control form-control-sm"
              value={specialisation}
              onChange={e => setSpecialsation(e.target.value)}
            />
          </Specialisation>

          <Button type="submit" variant="contained" color="primary" onClick={submitForm}>
            Submit
          </Button>
        </form>
      </SubmitField>
    </Container>
  );
}

const Container = styled.div `
  min-width: calc(100vw - 400px);
  height: 100%;

  h1 {
    margin-left: 17%;
    margin-bottom: 3%;
    margin-top: 1%;
    font-weight: 300;
  }
`
const PaperStyled = styled(Paper) `
  min-height: 150px;
  min-width: 200px;
  height: 100%;
`
const GridStyled = styled(Grid)`
  h3 {
    margin-left: 85%;
    margin-top: 22%;
    font-weight: 10;
  }
`
const SubmitField = styled.div `
    margin-left: 17%;
    margin-top: 2%;

    form {
        width: 100%;
        display: flex;
        align-items: center;
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

export default SubmitPlan
