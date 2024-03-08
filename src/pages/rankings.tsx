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
        <div className="d-flex gap-3 justify-content-end">
            <RaidPicker raid={raid} setRaid={setRaid} />
            {raid && (
                <EncounterPicker
                    raidId={raid.value}
                    encounter={encounter}
                    setEncounter={setEncounter}
                />
            )}
        </div>
    )

    return (
        <>
            <Layout title="Rankings" topComponents={topComponents}>
                {encounter && (
                    <TopRankingPerformersTable encounter={encounter} />
                )}
            </Layout>
        </>
    )
}

export default Rankings
