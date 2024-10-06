import React from 'react'
import Card from './Card'
import styled from 'styled-components'

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

interface Props {}

function CardDeck(props: Props) {
    const {} = props

    return (
        <Wrapper>
            <Card card="2" color="red"/>
            <Card card="reverse" color="blue"/>
            <Card card="block" color="red"/>
            <Card card="0" color="yellow"/>
            <Card card="plus4" color="common" />
        </Wrapper>
    )
}

export default CardDeck
