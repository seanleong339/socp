import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { CircularProgress } from '@material-ui/core'
import axios from '../nusmodsAxios'

function SemesterPlan(props) {

    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        async function fillData(moduleCodes) {
            var fillModules = []
            for (let i = 0; i < moduleCodes.length; i++) {
                const code = moduleCodes[i].toUpperCase()
                const data = axios.get(`https://api.nusmods.com/v2/2020-2021/modules/${code}.json`).catch(e => code)
                fillModules.push(data)
            }
            Promise.all(fillModules).then(values => {
              setModules([...values])
              setLoading(false)
            })
        }

        if (props.modules) {
          fillData(props.modules).catch(e => console.log(e))
        } else {
          setLoading(false)
        }
    }, [props.modules])



    return (
        <Container>
            <Modules>
                {loading && <CircularProgress size={25} style={{color: 'white', marginLeft: '5%', marginTop: '5%'}}/>}
                <ul>
                    {modules.map(module => ( module.data ? 
                        <li>
                            <span><b>{module.data.title}</b> {module.data.moduleCode} {module.data.moduleCredit}MC</span>
                        </li> : 
                        <li>
                            <span><b>{module.toUpperCase()}</b></span>
                        </li>
                    ))}
                </ul>
            </Modules>
            
        </Container>
    )
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
    display: flex;
    align-items: center;
    ul {
        margin-top: 2%;
    }
    span {
        font-size: 13px;
        color: #FAF9F6;
    }


`


export default SemesterPlan
