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
    setAuctionHouseId: React.Dispatch<React.SetStateAction<any>>
}

const RealmPicker: React.FC<RealmPickerProps> = ({
    faction,
    auctionHouseId,
    setAuctionHouseId,
}) => {
    const loadOptions = () => {
        return axios
            .get(`/api/v1/tsm/realms?faction=${encodeURIComponent(faction)}`)
            .then(({ data }) => {
                return data.map((result: FilteredResult) => ({
                    label: `${result.realmName} (${result.gameVersion} - ${result.region})`,
                    value: result.auctionHouseId,
                }))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                return []
            })
    }

    const onChange = (selectedOption: any) => {
        setAuctionHouseId(selectedOption ? selectedOption.value : 0)
    }

    const selectedOption = loadOptions().then((options) =>
        options.find((option: any) => option.value === auctionHouseId)
    )

    return (
        <AsyncSelect
            loadOptions={loadOptions}
            noOptionsMessage={() => 'Unable to load auction houses'}
            loadingMessage={() => 'Loading...'}
            value={selectedOption}
            onChange={onChange}
        />
    )
}

export default RealmPicker
