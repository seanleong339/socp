import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SemesterPlan from './SemesterPlan'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import teal from "@material-ui/core/colors/teal"
import axios from '../dbAxios'
import { useParams, useLocation } from 'react-router'


const useStyles = makeStyles((theme) => ({
    tealPaper: {
      backgroundColor: teal[800]
    }
  }))


function ShowPlans() {

    const classes = useStyles()

    const [studyPlans, setStudyPlans] = useState([])

    var { major, specialisation } = useParams()

    let location = useLocation() // updates app whenever 'find a plan' changes

    useEffect(() => {
        
        async function getData() {
            let studyPlanData
            if (major) {
                if (specialisation) {
                    studyPlanData = await axios.get(`/api/sample?major=${major}&specialisation=${specialisation}`)
                } else {
                    studyPlanData = await axios.get(`/api/sample?major=${major}`)
                }
            } else {
                studyPlanData = await axios.get(`/api/sample`)
            }
            setStudyPlans(studyPlanData.data.plans)
            
            
        }
        getData()
        
    }, [location])

    

    return (
        <Container>
            { studyPlans.length == 0 ? 
            <Description>
                <h2>No Plans Yet</h2>
            </Description>
             : 
            studyPlans.map(plan => (
            <>
            <Description>
                <h5>{plan.major.toUpperCase()}</h5>
                <h7>{plan.specialisation && plan.specialisation.toUpperCase()}</h7>
            </Description>
           
            <Grid container spacing={3}>
                <GridStyled item xs={2}><h3>Y1</h3></GridStyled>
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
                <GridStyled item xs={2}><h3>Y2</h3></GridStyled>
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
                <GridStyled item xs={2}><h3>Y3</h3></GridStyled>
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
                <GridStyled item xs={2}><h3>Y4</h3></GridStyled>
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
            </>
            )) }
        </Container>
    )
}

const Container = styled.div `
    min-width: calc(100vw - 400px);
    height: 100%;

    
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
const Description = styled.div`
  display: flex;
  margin-top: 60px;
  margin-bottom: 10px;

  h5 {
    margin-left: 17%;
    margin-right: 1%;
  }

  h2 {
      margin-left: 17%;
      margin-bottom: 40%;
  }

`;

export default ShowPlans
