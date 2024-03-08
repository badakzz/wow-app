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

    return (
        <>
            <Layout title="Rankings">
                <div className="d-flex justify-content-between ">
                    <div className="flex-half text-align-start">
                        <h1 className="mb-5">Rankings</h1>
                    </div>
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
                </div>
                {encounter && (
                    <TopRankingPerformersTable encounter={encounter} />
                )}
            </Layout>
        </>
    )
}

export default Rankings
