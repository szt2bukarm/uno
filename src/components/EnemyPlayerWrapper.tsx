import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import EnemyPlayer from './EnemyPlayer'
import useStore from '../store.js'

const Wrapper = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1;
`

const InnerWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 100rem;
`

const Players = styled.div`
    position: absolute;
    top: 0;
    left: 50%;
    /* transform: translateX(-1500px); */
    display: flex;
    transition: transform .5s cubic-bezier(.78,.14,.24,.85);

`



function EnemyPlayerWrapper() {
    const { currentPlayer,playerNo,numberOfPlayers,playerList,onlineMatch } = useStore();
    const [transform,setTransform] = useState(50);

    const getTransform = () => {
        if (currentPlayer >= playerNo) {
            setTransform((currentPlayer-1)*100+50)
            return;
        }
        setTransform(currentPlayer*100+50)
    }

    useEffect(() => {
        setTimeout(() => {
            getTransform();  
        }, 500);
    },[currentPlayer])

    return (
        <Wrapper>
            <InnerWrapper>
            <Players style={{transform: `translateX(-${transform}rem)`}}>
                {!onlineMatch && 
                    [...Array(numberOfPlayers-1)].map((_,i) => <EnemyPlayer playerNo={i+1} playerName={`Bot ${i+1}`} isBot={true} key={i+1} />)
                }
                {onlineMatch && playerList.map((p) => {
                    if (p.idx != playerNo) return <EnemyPlayer playerNo={p.idx} playerName={p.name} isBot={p.isBot} key={p.idx} /> 
                })}
                </Players>
            </InnerWrapper>
        </Wrapper>
    )
}

export default EnemyPlayerWrapper
