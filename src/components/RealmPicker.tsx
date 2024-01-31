import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { AuctionHouse } from '../utils/types'

type RealmPickerProps = {
    region: string
    faction: string
    auctionHouseId: number | null
    setAuctionHouseId: React.Dispatch<React.SetStateAction<number | null>>
}

const RealmPicker: React.FC<RealmPickerProps> = ({
    faction,
    region,
    auctionHouseId,
    setAuctionHouseId,
}) => {
    const [currentAuctionHouse, setCurrentAuctionHouse] = useState<any>(null)

    const fetchRealmsByValue = async (inputValue: string) => {
        try {
            const response = await axios.get<AuctionHouse[]>(
                `/api/v1/tsm/realms?faction=${encodeURIComponent(
                    faction
                )}&region=${encodeURIComponent(
                    region
                )}&hint=${encodeURIComponent(inputValue)}`
            )
            return response.data.map((result) => ({
                label: `${result.realmName}`,
                value: result.auctionHouseId,
            }))
        } catch (error) {
            console.error('Error fetching data:', error)
            return []
        }
    }

    useEffect(() => {
        if (auctionHouseId === null) {
            setCurrentAuctionHouse(null)
        }
    }, [auctionHouseId])

    useEffect(() => {
        setCurrentAuctionHouse(null)
        setAuctionHouseId(null)
    }, [faction, region])

    const onChange = (selectedOption: any) => {
        setAuctionHouseId(selectedOption ? selectedOption.value : null)
        setCurrentAuctionHouse(selectedOption)
    }

    return (
        <AsyncSelect
            loadOptions={fetchRealmsByValue}
            noOptionsMessage={() => 'Unable to load auction houses'}
            loadingMessage={() => 'Loading...'}
            placeholder={'Select a realm...'}
            cacheOptions
            defaultOptions
            value={currentAuctionHouse}
            onChange={onChange}
            isSearchable
            classNamePrefix="react-select"
        />
    )
}

export default RealmPicker
