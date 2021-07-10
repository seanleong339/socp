import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SemesterPlan from './SemesterPlan'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import teal from "@material-ui/core/colors/teal"
import { Link } from "react-router-dom"
import axios from '../dbAxios'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import MessageIcon from '@material-ui/icons/Message'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme) => ({
    tealPaper: {
      backgroundColor: teal[800]
    },
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
      {name: "General", value: null},
      {name: "Financial Analytics", value: "financial analytics"},
      {name: "Marketing Analytics", value: "marketing analytics"}
    ], 
    'information systems': [
      {name: "General", value: null},
      {name: "Digital Innovation", value: "digital innovation"},
      {name: "Electronic Commerce", value: "electronic commerce"},
      {name: "Financial Technology", value: "financial technology"}
    ], 
    'information security': [
      {name: "General", value: null},
    ]
  }

function showSpecialisations(major) {
  return (
    <>
    <option value="">All</option>
    { specialisations[major].map(x => (
      <option value={x.value}>{x.name}</option>
    ))
    }
    </>
  )
}


function ShowPlans() {

    const classes = useStyles()

    const [ major, setMajor ] = useState('')
    const [ specialisation, setSpecialisation ] = useState('')
    const [ studyPlans, setStudyPlans ] = useState([])
  
    const [ buttonState, setButtonState ] = useState(JSON.parse(localStorage.getItem('reactionState')) || {})
  
  useEffect(() => {
    async function getData() {
      const studyPlanData = await axios.get(`/sample`)
      setStudyPlans(studyPlanData.data.plans)
    }
    
    getData()
        
  }, [])

  useEffect(() => {
    localStorage.setItem('reactionState', JSON.stringify(buttonState))
  }, [buttonState])



  async function filter(event) {
    event.preventDefault()

    let studyPlanData
    if (major !== '') {
      if (specialisation !== null) {
        studyPlanData = await axios.get(`/sample?major=${major}&specialisation=${specialisation}`)
      } else {
        studyPlanData = await axios.get(`/sample?major=${major}`)
      }
    } else {
      studyPlanData = await axios.get(`/sample`)
    }
    console.log(studyPlanData)
    setStudyPlans(studyPlanData.data.plans)
  }

  // update votes on the database
  async function reactionClick(planID) { 
    if (buttonState.hasOwnProperty(planID)) { 
      if (buttonState[planID] === 1) { // plan currently liked
        const buttonStateClone = {...buttonState}
        buttonStateClone[planID] = 0
        setButtonState(buttonStateClone)
        updateVotes(-1, planID)
        await axios.post('/sample/voting', {
          id: planID,
          value: -1
        })
        } else if (buttonState[planID] === 0) { // plan currently no like/dislike
          const buttonStateClone = {...buttonState}
          buttonStateClone[planID] = 1
          setButtonState(buttonStateClone)
          updateVotes(1, planID)
          await axios.post('/sample/voting', {
            id: planID,
            value: 1
          })

      }
    } else {
      const buttonStateClone = {...buttonState}
      buttonStateClone[planID] = 1
      setButtonState(buttonStateClone)
      updateVotes(1, planID)
      await axios.post('/sample/voting', {
        id: planID,
        value: 1
      })
      
    }
  }

  // update votes locally (to display to viewer)
  function updateVotes(change, planID) {
    let plan
    for (let i = 0; i < studyPlans.length; i++) {
      if (studyPlans[i]._id === planID) {
        plan = studyPlans[i]
        plan.votes = plan.votes + change
      }
    }
  }

    return (
      <Container>
        <Heading>
          <h2 class="header" data-testid="showplans_header">Study Plans</h2>
          <form>
            <Major>
              <span>MAJOR: </span>
              <select
                className="form-select form-select-sm"
                name="major"
                id="major"
                data-testid="showplans_major"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              >
                <option value="">All</option>
                <option value="computer science">Computer Science</option>
                <option value="business analytics">Business Analytics</option>
                <option value="information systems">Information Systems</option>
                <option value="information security">
                  Information Security
                </option>
              </select>
            </Major>

            <Specialisation>
              <span>SPECIALISATION: </span>
              <select
              className="form-select form-select-sm"
              name="specialisation"
              id="specialisation"
              data-testid="showplans_specialisation"
              value={specialisation}
              onChange={e => setSpecialisation(e.target.value)}
              disabled={major === "" || major === "information security"}>
                {
                   (major === "" || major === "information security") 
                   ? <option></option>
                   : showSpecialisations(major)
                }

              </select>
  
            </Specialisation>

            <FilterButton data-testid="showplans_filterButton" type="submit" onClick={filter}>
              SHOW PLANS
            </FilterButton>
          </form>
        </Heading>
        {studyPlans.length === 0 ? (
          <ErrorMsg>
            <h2>No Plans Found! 😭</h2>
          </ErrorMsg>
        ) : (
          studyPlans.map((plan) => (
            <>
              <Description>
                <h5 style={{color: "#8cecf0"}}>{plan.major.toUpperCase()}</h5>
                <h7 style={{color: "#8cecf0"}}>{plan.specialisation && plan.specialisation.toUpperCase()}</h7>
                  <ImportLink
                  to = {{
                    pathname: '/',
                    state: { plan }
                  }}
                  >
                    <b>IMPORT PLAN</b>
                  </ImportLink>
              </Description>

              <Grid container spacing={3}>
                <GridStyled item xs={2}>
                  <h3>Y1</h3>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y1s1} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y1s2} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={2}>
                  <h3>Y2</h3>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y2s1} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y2s2} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={2}>
                  <h3>Y3</h3>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y3s1} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y3s2} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={2}>
                  <h3>Y4</h3>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y4s1} />
                  </PaperStyled>
                </GridStyled>
                <GridStyled item xs={5}>
                  <PaperStyled className={classes.tealPaper} elevation={2}>
                    <SemesterPlan modules={plan.y4s2} />
                  </PaperStyled>
                </GridStyled>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={2}></Grid>
                <Grid item xs={10}>
                <ReactionBar>
                  <ReactionButton data-testid="showplans_thumbsUpButton" onClick={e => reactionClick(plan._id)} color="primary">
                    <ThumbUpIcon data-testid="showplans_thumbsUpIcon" style={{fill: (buttonState.hasOwnProperty(plan._id) && buttonState[plan._id] === 1) ? "#0288d1" : "white", fontSize: 20}}/>
                  </ReactionButton>
                  {plan.votes 
                    ? plan.votes === 1 ?
                      <div style={{marginRight: '2%', whiteSpace: 'nowrap'}}>1 Vote</div> : <div style={{marginRight: '2%', whiteSpace: 'nowrap'}}>{plan.votes} Votes</div>
                    : <div style={{marginRight: '2%', whiteSpace: 'nowrap'}}>No Votes Yet</div>
                  }

                  <CommentLink to = {{
                    pathname: '/comments',
                    state: { plan }
                  }}>
                    <MessageIcon style={{fill: 'white', fontSize: 20}} />
                  </CommentLink>
                </ReactionBar>
                </Grid>
              </Grid>
              
            </>
          ))
        )}
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
const Description = styled.div`
  display: flex;
  margin-top: 60px;
  margin-bottom: 10px;
  align-items: center;

  h5 {
    margin-left: 17%;
    margin-right: 1%;
  }

  h7 {
    margin-bottom: 0.3%;
    margin-right: 1%;
  }

`
const ErrorMsg = styled.div `
  margin-top: 10%;
  margin-left: 13%;
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
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 90%;
  
    h2 {
      white-space: nowrap;
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
const FilterButton = styled.button `
  background: #0288d1;
  border: none;
  color: white;
  padding: 6px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 1.1px;
  white-space: nowrap;

  &:hover {
    background: #0277bd;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`
const ReactionBar = styled.div `
  display: flex;
  align-items: center;
`
const ReactionButton = styled(IconButton) `
  &:hover {
    color: 'white';
  }
`
const CommentLink = styled(Link) `

`
const ImportLink = styled(Link) `
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
  margin-bottom: 5px;
  text-decoration: none;

  &:hover {
    background: #4caf50;
    color: #e1f5fe;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
  }
`


export default ShowPlans
