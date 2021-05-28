import React from 'react'
import styled from 'styled-components'
import Semester from './Semester'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import teal from "@material-ui/core/colors/teal"

const useStyles = makeStyles((theme) => ({
  tealPaper: {
    backgroundColor: teal[800]
  }
}))

function Planner() {

  const classes = useStyles()

  return (
    <Container>
      <h1>Module Planner</h1>
      <Grid container spacing={3}>
        <GridStyled item xs={2}><h3>Y1</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y1s1'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y1s2'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y2</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y2s1'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y2s2'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y3</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y3s1'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y3s2'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y4</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y4s1'} submit={false} />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester id={'y4s2'} submit={false} />
          </PaperStyled>
        </GridStyled>
      </Grid>


    </Container>
  )
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

export default Planner
