import { CSSProperties, FunctionComponent, useEffect } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { Encounter } from '../utils/types'
import { OptionProps, SingleValueProps, components } from 'react-select'
import { Image } from 'react-bootstrap'

type EncounterPickerProps = {
    encounter: Encounter | null
    setEncounter: React.Dispatch<React.SetStateAction<Encounter | null>>
} & any

const EncounterPicker: React.FC<EncounterPickerProps> = ({
    raidId,
    encounter,
    setEncounter,
    ...restOfProps
}) => {
    const fetchRaids = async (inputValue: string) => {
        try {
            const response = await axios.post(`/api/v1/warcraftlogs/raids`, {
                operation: 'listEncounters',
                parameters: { raidId },
            })
            const options = response.data.map(
                (encounter: { id: number; name: string }) => ({
                    label: encounter.name,
                    value: encounter.id,
                })
            )
            if (options.length > 0 && !encounter) setEncounter(options[0])
            return options
        } catch (error) {
            console.error('Error fetching raids:', error)
            return []
        }
    }

    const onChange = (selectedOption: Encounter) => {
        setEncounter(selectedOption)
    }

    useEffect(() => {
        if (raidId) {
            setEncounter(null)
        }
    }, [raidId])

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <div className="d-flex align-items-center justify-content-start gap-2">
                    <Image
                        src={`/${props.data.value}-icon.jpg`}
                        alt="encounter-icon"
                        className="circular-icon"
                    />
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        )
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    src={`/${props.data.value}-icon.jpg`}
                    alt="encounter-icon"
                    className="circular-icon"
                />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    )

    return (
        <div style={styles.fixedWidth}>
            <AsyncSelect
                {...restOfProps}
                instanceId={'encounterPicker'}
                loadOptions={fetchRaids}
                noOptionsMessage={() => 'No encounter found'}
                loadingMessage={() => 'Loading...'}
                placeholder={'Select a encounter...'}
                cacheOptions
                defaultOptions
                value={encounter}
                onChange={onChange}
                isSearchable={false}
                classNamePrefix="react-select"
                key={`encounter-picker-${raidId}`}
                components={{ SingleValue, Option }}
            />
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    fixedWidth: {
        width: '15rem',
    },
}

export default EncounterPicker
