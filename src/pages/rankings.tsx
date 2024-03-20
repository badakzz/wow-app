import { useState } from 'react'
import { Encounter, Raid } from '../utils/types'
import {
    RaidPicker,
    EncounterPicker,
    TopRankingPerformersTable,
    Layout,
} from '../components'

const Rankings = () => {
    const [raid, setRaid] = useState<Raid | null>(null)
    const [encounter, setEncounter] = useState<Encounter | null>(null)

    const topComponents = (
        <div className="rankings-pickers-wrapper d-flex gap-3">
            <RaidPicker className="raid-picker" raid={raid} setRaid={setRaid} />
            {raid && (
                <EncounterPicker
                    className="encounter-picker"
                    raidId={raid.value}
                    encounter={encounter}
                    setEncounter={setEncounter}
                />
            )}
        </div>
    )

    return (
        <>
            <Layout
                title="Rankings"
                topComponents={topComponents}
                topComponentsFlexClass="justify-content-end"
            >
                {encounter && (
                    <TopRankingPerformersTable encounter={encounter} />
                )}
            </Layout>
        </>
    )
}

export default Rankings
