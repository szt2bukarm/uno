import React from 'react'
import styled from 'styled-components'
import gsap from 'gsap'
import EnemyPlayer from './EnemyPlayer'

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
    perspective: 1000px;
`



function EnemyPlayerWrapper() {

    return (
        <Wrapper>
            <InnerWrapper>
                <EnemyPlayer playerNo={1}/>
            </InnerWrapper>
        </Wrapper>
    )
}

export default EnemyPlayerWrapper
