import axios from 'axios'
import Head from 'next/head'
import { Container, Image } from 'react-bootstrap'
import { useState } from 'react'
import { Encounter, Raid } from '../utils/types'
import {
    RaidPicker,
    EncounterPicker,
    TopRankingPerformersTable,
} from '../components'

const Rankings = () => {
    const [raid, setRaid] = useState<Raid | null>(null)
    const [encounter, setEncounter] = useState<Encounter | null>(null)

    return (
        <>
            <Head>
                <title>Wow App</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container className="container-top-margin main-container p-5">
                <div className="d-flex align-items-center justify-content-center">
                    <div className="flex-half text-align-start">
                        <h1 className="mb-5">Rankings</h1>
                    </div>
                    <RaidPicker raid={raid} setRaid={setRaid} />
                    {raid && (
                        <EncounterPicker
                            raidId={raid.value}
                            encounter={encounter}
                            setEncounter={setEncounter}
                        />
                    )}
                </div>
                {encounter && (
                    <TopRankingPerformersTable encounter={encounter} />
                )}
            </Container>
        </>
    )
}

export default Rankings
