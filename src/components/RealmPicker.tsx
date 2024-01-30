import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'

interface FilteredResult {
    region: string
    gameVersion: string
    realmName: string
    auctionHouseId: number
}

type RealmPickerProps = {
    faction: string
    auctionHouseId: number | null
    setAuctionHouseId: React.Dispatch<React.SetStateAction<number | null>>
}

const RealmPicker: React.FC<RealmPickerProps> = ({
    faction,
    auctionHouseId,
    setAuctionHouseId,
}) => {
    const [currentAuctionHouse, setCurrentAuctionHouse] = useState<any>(null)

    const fetchRealmsByValue = async (inputValue: string) => {
        try {
            const response = await axios.get<FilteredResult[]>(
                `/api/v1/tsm/realms?faction=${encodeURIComponent(
                    faction
                )}&hint=${encodeURIComponent(inputValue)}`
            )
            return response.data.map((result) => ({
                label: `${result.realmName} (${result.gameVersion} - ${result.region})`,
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
        setCurrentAuctionHouse(null) // Clear the selection when the faction changes
        setAuctionHouseId(null)
    }, [faction])

    const onChange = (selectedOption: any) => {
        setAuctionHouseId(selectedOption ? selectedOption.value : null)
        setCurrentAuctionHouse(selectedOption)
    }

    return (
        <AsyncSelect
            loadOptions={fetchRealmsByValue}
            noOptionsMessage={() => 'Unable to load auction houses'}
            loadingMessage={() => 'Loading...'}
            cacheOptions
            defaultOptions
            value={currentAuctionHouse}
            onChange={onChange}
            isSearchable
        />
    )
}

export default RealmPicker
