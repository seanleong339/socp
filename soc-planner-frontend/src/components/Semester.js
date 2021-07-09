import styled from 'styled-components'
import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ClearSharpIcon from '@material-ui/icons/ClearSharp'
import ClearAllIcon from '@material-ui/icons/ClearAll'
import { makeStyles } from '@material-ui/core'
import axios from '../nusmodsAxios'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { TextField } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  deleteIcon: {
    fontSize: 'medium',
    fill: '#cfcfcf',
    '&:hover': {
      fill: 'white'
    }
  },
  addIcon: {
    fill: '#8cecf0', 
    fontSize: 25,
    '&:hover': {
      fill: '#bff0f2'
    }
  }, 
  deleteAllIcon: {
    fill: '#74c9cc',
    '&:hover': {
      fill: '#bff0f2'
    }
  }

}))

function Semester(props) {

    const classes = useStyles()

    const [modules, setModules] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [input, setInput] = useState('')
    const [credits, setCredits] = useState(0)
    const [allMods, setAllMods] = useState([])
    const previousValues = useRef({modules, credits})

    // Following props are for creating custom module
    const [ customModuleCode, setCustomModuleCode ] = useState("")
    const [ customModuleTitle, setCustomModuleTitle] = useState("")
    const [ customModuleCredits, setCustomModuleCredits ] = useState() 

    useEffect(() => {
      async function getMods() {
        let modsData = await axios.get("https://api.nusmods.com/v2/2021-2022/moduleList.json")
        setAllMods(modsData.data)
      }

      getMods()
   
    }, [])

    useEffect(() => {
      async function addModuleFromProps(moduleCode) {
        let moduleData = await axios.get(`https://api.nusmods.com/v2/2021-2022/modules/${moduleCode.toUpperCase()}.json`)
        return moduleData
      }

      if (props.mods.length > 0) { // if plan is in local storage
        const promises = []
        for (let i = 0; i < props.mods.length; i++) {
          promises.push(addModuleFromProps(props.mods[i]))
        }
        Promise.allSettled(promises).then(
          results => (
            results.map(result => result.status === "fulfilled" ? result.value : null).filter(x => x !== null)
          )
        ).then(
          results => {
            setModules([...modules, ...results])
            let sum = 0
            results.forEach(x => sum = sum + Number(x.data.moduleCredit))
            setCredits(credits + sum)         
          }
        )
          
      }   

    }, [])

    useEffect(() => {
      if (previousValues.current.modules !== modules && previousValues.current.credits !== credits) {
        const moduleCodes = modules.map(mod => mod.data.moduleCode.toUpperCase())
        props.func(props.id, moduleCodes, credits)
        previousValues.current = { modules, credits }
      }
    })

    

    async function addModule(event) {
        event.preventDefault()
        let moduleData
        if (input) {
          moduleData = await axios.get(`https://api.nusmods.com/v2/2021-2022/modules/${input.split(" ")[0].toUpperCase()}.json`)
        } else {
          moduleData = new Object()
          moduleData.data = new Object()
          moduleData.data.moduleCredit = customModuleCredits
          moduleData.data.moduleCode = customModuleCode
          moduleData.data.title = customModuleTitle
        }
        setModules([...modules, moduleData])
        setCredits(credits + Number(moduleData.data.moduleCredit))
        setInput('')
        setDialogOpen(false)
    }

    function deleteModule(moduleCode) {
        var modCredits
        var filteredModules = [...modules]
        
        for (let i = 0; i < modules.length; i++) {
            if (moduleCode === modules[i].data.moduleCode) {
                modCredits = Number(modules[i].data.moduleCredit)

                filteredModules.splice(i, 1)
                setModules(filteredModules)
                setCredits(credits - modCredits)
                break
            }
        }
    }

    function clearSemester() {
      setModules([])
      setCredits(0)
    }

    return (
      <Container>
        <Dialog
          open={dialogOpen}
          onClose={(e) => setDialogOpen(false)}
          PaperProps={{
            style: {
              backgroundColor: "white",
            },
          }}
        >
          <DialogTitle data-testid="semester_searchDialog"><h4>Search For NUS Module</h4></DialogTitle>
          <DialogContent>
              <Autocomplete
                style={{width: 495}}
                onInputChange={(event, input) => setInput(input)}
                options={allMods}
                getOptionLabel={(option) => option["moduleCode"] + " " + option["title"]}
                renderInput={(params) => 
                    allMods.length === 0 ?
                    <CircularProgress /> : 
                    <TextField {...params} variant="outlined" disabled={customModuleTitle || customModuleCode || customModuleCredits} />
                }
                />
          </DialogContent>
          <DialogTitle><h4>Or Enter A Custom Module</h4></DialogTitle>
          <DialogContent>
            <form>
              <TextField style={{width: '90%', marginBottom: "20px"}} value={customModuleCode} onChange={e => setCustomModuleCode(e.target.value)} disabled={input} type="text" id="moduleCode" placeholder="Enter Module Code" autoComplete="off" variant="outlined" /> 
              <TextField style={{width: '90%', marginBottom: "20px"}} value={customModuleTitle} onChange={e => setCustomModuleTitle(e.target.value)} disabled={input} type="text" id="moduleTitle" placeholder="Enter Module Title" autoComplete="off" variant="outlined" />
              <TextField style={{width: '90%'}} value={customModuleCredits} onChange={e => setCustomModuleCredits(e.target.value)} disabled={input} type="number" min="0" max="20" id="moduleCredits" placeholder="Module Credits" autoComplete="off" variant="outlined" />
            </form>
          </DialogContent>

             <DialogActions>
                <Button disabled={!(input || (customModuleCode && customModuleTitle && customModuleCredits))} type="submit" color="primary" onClick={addModule}>Add Module</Button>
                <Button onClick={e => setDialogOpen(false)}>Cancel</Button>
              </DialogActions>  
        </Dialog>
        <SemInfo>
          <span data-testid="semester_noMods">{modules.length}</span>&nbsp;
          {modules.length === 1 ? <span>module</span> : <span>modules</span>}{" "}
          &nbsp;&nbsp;&nbsp; <span data-testid="semester_noMCs">{credits}</span>MCs &nbsp;&nbsp;&nbsp;&nbsp;
          <Actions>
            <IconButton
              style={{marginRight: '13%'}}
              onClick={(e) => setDialogOpen(true)}
              data-testid="semester_addButton"
              data-bs-toggle="collapse"
              size="small"
              title="Add a Module"
            >
              <AddCircleIcon className={classes.addIcon} />
            </IconButton>
            <ClearButton
              title="Clear Semester"
              onClick={(e) => clearSemester()}
            >
              <ClearAllIcon className={classes.deleteAllIcon} />
            </ClearButton>
          </Actions>
        </SemInfo>

        <Modules>
          <ul>
            {modules.map((module) => (
              <li>
                <span>
                  <b>{module.data.title}</b> {module.data.moduleCode.toUpperCase()}{" "}
                  {module.data.moduleCredit}MC
                </span>
                <IconButton
                  onClick={(e) => deleteModule(module.data.moduleCode)}
                >
                  <ClearSharpIcon className={classes.deleteIcon} />
                </IconButton>
              </li>
            ))}
          </ul>
        </Modules>
      </Container>
    );
}

const Container = styled.div `
    // box-shadow: 0px 0px 0px 3px rgba(0,0,0,0.3);
    height: 100%;
    min-width: 250px;
    border-radius: 15px;
    margin: 0 1%;
    position: relative;
`

const Modules = styled.div `
    width: 80%;
    span {
        font-size: 13px;
        color: #FAF9F6;
    }

    li {
        display: flex;
        align-items:center;
        justify-content: space-between;
        width: 80%;
    }
`
const SemInfo = styled.span `
    display: flex;
    align-items: center;
    white-space: nowrap;
    color: white;
    font-size: 13px;
    padding-left: 4.3%;
    padding-top: 1%;
`
const ClearButton = styled.button  `
    background: none;
    border: none;
    font-size: 13px;
    letter-spacing: 1px;
`
const Actions = styled.div `
    margin-right: 3%;
    margin-left: auto;
`

export default Semester
