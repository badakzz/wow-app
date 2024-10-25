import { useCallback, useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { AuctionHouse } from '../utils/types'
import { useToast } from '../utils/hooks'

type RealmPickerProps = {
    region: string
    faction: string
    auctionHouseId: number | null
    setAuctionHouseId: React.Dispatch<React.SetStateAction<number | null>>
} & any

const RealmPicker: React.FC<RealmPickerProps> = ({
    faction,
    region,
    setAuctionHouseId,
    ...restOfProps
}) => {
    const [currentAuctionHouse, setCurrentAuctionHouse] = useState<{
        label: string
        value: number
    } | null>(null)
    const { showToast } = useToast()

    const debouncedFetchRealms = useCallback(
        debounce(
            async (inputValue: string, callback: (options: any) => void) => {
                try {
                    const response = await axios.get<AuctionHouse[]>(
                        `/api/v1/tsm/realms?faction=${encodeURIComponent(
                            faction
                        )}&region=${encodeURIComponent(
                            region
                        )}&hint=${encodeURIComponent(inputValue)}`
                    )
                    const options = response.data.map((result) => ({
                        label: `${result.realmName}`,
                        value: result.auctionHouseId,
                    }))
                    if (options.length > 0 && !currentAuctionHouse)
                        // setCurrentAuctionHouse(options[0])
                        // temp
                        setCurrentAuctionHouse({
                            label: 'Living Flame',
                            value: 513,
                        })
                    callback(options)
                } catch (error: any) {
                    showToast({
                        message: `Error fetching TSM's API: ${error.message}`,
                    })
                    callback([])
                }
            },
            200
        ),
        [faction, region]
    )

    const fetchRealmsByName = (
        inputValue: string,
        callback: (options: any) => void
    ) => {
        debouncedFetchRealms(inputValue, callback)
    }

    useEffect(() => {
        setCurrentAuctionHouse(null)
        setAuctionHouseId(null)
    }, [region])
    useEffect(() => {
        currentAuctionHouse?.value &&
            setAuctionHouseId(currentAuctionHouse.value)
    }, [currentAuctionHouse])

    const onChange = (selectedOption: any) => {
        setAuctionHouseId(selectedOption ? selectedOption.value : null)
        setCurrentAuctionHouse(selectedOption)
    }

    return (
        <>
            <AsyncSelect
                {...restOfProps}
                instanceId={'realmPicker'}
                loadOptions={fetchRealmsByName}
                noOptionsMessage={() => 'No realm matching criteria found'}
                loadingMessage={() => 'Loading...'}
                placeholder={'Select a realm...'}
                cacheOptions
                defaultOptions
                value={currentAuctionHouse}
                onChange={onChange}
                isSearchable
                classNamePrefix="react-select"
                key={`${faction}-${region}`}
            />
        </>
    )
}

export default RealmPicker
