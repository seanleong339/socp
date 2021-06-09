import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ClearRoundedIcon from '@material-ui/icons/ClearRounded'
import axios from '../nusmodsAxios'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { TextField } from '@material-ui/core'

function Semester(props) {

    const [modules, setModules] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [input, setInput] = useState('')
    const [credits, setCredits] = useState(0)
    const [allMods, setAllMods] = useState([])

    // Following props are for creating custom module
    const [ customModuleCode, setCustomModuleCode ] = useState("")
    const [ customModuleTitle, setCustomModuleTitle] = useState("")
    const [ customModuleCredits, setCustomModuleCredits ] = useState() 

    useEffect(() => {
      async function getMods() {
        let modsData = await axios.get("https://api.nusmods.com/v2/2020-2021/moduleList.json")
        setAllMods(modsData.data)
      }

      async function addModuleFromProps(moduleCode) {
        let moduleData = await axios.get(`https://api.nusmods.com/v2/2020-2021/modules/${moduleCode.toUpperCase()}.json`)
        setModules(prevState => [...prevState, moduleData])
        setCredits(prevState => prevState + Number(moduleData.data.moduleCredit))
      }

      getMods()

      if (props.mods.length > 0) { // if plan is in local storage
        for (let i = 0; i < props.mods.length; i++) {
          addModuleFromProps(props.mods[i])
        }
      }
      
    }, [])

    async function addModule(event) {
        event.preventDefault()
        let moduleData
        if (input) {
          moduleData = await axios.get(`https://api.nusmods.com/v2/2020-2021/modules/${input.split(" ")[0].toUpperCase()}.json`)
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
        const moduleCodes = modules.map(mod => mod.data.moduleCode) // take only the codes
        props.func(props.id, [...moduleCodes, moduleData.data.moduleCode], Number(moduleData.data.moduleCredit), true)
    }

    function deleteModule(moduleCode) {
        var modCredits
        var filteredModules = modules
        
        console.log('modules:', modules)
        for (let i = 0; i < modules.length; i++) {
            if (moduleCode === modules[i].data.moduleCode) {
                modCredits = Number(modules[i].data.moduleCredit)
                setCredits(credits - modCredits)
                filteredModules.splice(i, 1)
                break
            }
        }
        const filteredModuleCodes = filteredModules.map(mod => mod.data.moduleCode)
        setModules(filteredModules)
        props.func(props.id, filteredModuleCodes, modCredits, false)
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
          <DialogTitle><h4>Search For NUS Module</h4></DialogTitle>
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
          {modules.length}&nbsp;
          {modules.length === 1 ? <span>module</span> : <span>modules</span>}{" "}
          &nbsp;&nbsp;&nbsp; {credits}MCs &nbsp;&nbsp;&nbsp;&nbsp;
          <IconButton
            onClick={(e) => setDialogOpen(true)}
            data-bs-toggle="collapse"
            size="small"
          >
            <AddCircleIcon style={{ fill: "#8cecf0", fontSize: 25 }} />
          </IconButton>
        </SemInfo>

        <Modules>
          <ul>
            {modules.map((module) => (
              <li>
                <span>
                  <b>{module.data.title}</b> {module.data.moduleCode}{" "}
                  {module.data.moduleCredit}MC
                </span>
                <DeleteButton
                  onClick={(e) => deleteModule(module.data.moduleCode)}
                >
                  <ClearRoundedIcon />
                </DeleteButton>
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
const DeleteButton = styled(IconButton) `

`

const Modules = styled.div `
    width: 80%;
    span {
        font-size: 13px;
        color: #FAF9F6;
    }

    li {
        display: flex;
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

export default Semester
