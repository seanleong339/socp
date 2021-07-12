import React from 'react'
import styled from 'styled-components'
import SemesterPlan from './SemesterPlan'
import CommentsSection from './CommentsSection'
import { Grid, makeStyles, Paper } from '@material-ui/core'
import { teal } from '@material-ui/core/colors'
import { useLocation } from 'react-router'

const useStyles = makeStyles((theme) => ({
    tealPaper: {
        backgroundColor: teal[800]
    }
}))

function CommentsPage() {
    const location = useLocation()
    const plan = location.state.plan
    const classes = useStyles()

    return (
        <Container>
            <Description>
                <h5 style={{color: "#8cecf0"}}>{plan.major.toUpperCase()}</h5>
                <h7 style={{color: "#8cecf0"}}>{plan.specialisation && plan.specialisation.toUpperCase()}</h7>
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
                      <CommentsSection planID={plan._id} />
                  </Grid>
              </Grid>
            
        </Container>
    )
}

const Container = styled.div `
    height: 100%;
    min-height: calc(100vh - 60px);
    width: 100%;
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
const GridStyled = styled(Grid)`
  h3 {
    margin-top: 22%;
    font-weight: 10;
    text-align: center;
  }
`
const PaperStyled = styled(Paper) `
  min-height: 150px;
  min-width: 200px;
  height: 100%;
`


export default CommentsPage




