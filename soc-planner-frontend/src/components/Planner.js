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
      <Grid container spacing={3}>
        <GridStyled item xs={2}><h3>Y1</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y2</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y3</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={2}><h3>Y4</h3></GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
        <GridStyled item xs={5}>
          <PaperStyled className={classes.tealPaper} elevation={2}>
            <Semester />
          </PaperStyled>
        </GridStyled>
      </Grid>


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
`
const GridStyled = styled(Grid)`
  h3 {
    margin-left: 85%;
    margin-top: 22%;
    font-weight: 10;
  }
`

export default Planner
