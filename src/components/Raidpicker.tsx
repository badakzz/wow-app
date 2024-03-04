import React, { useCallback, useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { Raid } from '../utils/types'

type RaidPickerProps = {
    raid: Raid | null
    setRaid: React.Dispatch<React.SetStateAction<Raid | null>>
} & any

const RaidPicker: React.FC<RaidPickerProps> = ({
    raid,
    setRaid,
    ...restOfProps
}) => {
    const fetchRaids = async () =>
        axios
            .post(`/api/v1/warcraftlogs/raids`, {
                operation: 'listRaids',
            })
            .then((response) => {
                const options = response.data.map(
                    (raid: { name: string; id: number }) => ({
                        label: raid.name,
                        value: raid.id,
                    })
                )
                if (options.length > 0 && !raid) setRaid(options[0])
                return options
            })
            .catch((error) => {
                console.error('Error fetching raids:', error)
                return []
            })

    const onChange = (selectedOption: Raid) => {
        setRaid(selectedOption)
    }

    return (
        <AsyncSelect
            {...restOfProps}
            instanceId={'raidPicker'}
            loadOptions={fetchRaids}
            noOptionsMessage={() => 'No raid found'}
            loadingMessage={() => 'Loading...'}
            placeholder={'Select a raid...'}
            cacheOptions
            defaultOptions
            value={raid}
            onChange={onChange}
            isSearchable={false}
            classNamePrefix="react-select"
            key={`${raid?.id}`}
        />
    )
}

export default RaidPicker
