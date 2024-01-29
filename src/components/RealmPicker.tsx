import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Realm {
    auctionHouses: Array<any>
    locale: string
    localizedName: string
    name: string
    realmId: number
    gameVersion: string
}

type RealmPickerProps = {
    faction: string
}

const RealmPicker: React.FC<RealmPickerProps> = ({ faction }) => {
    // const [realms, setRealms] = useState<Realm>()

    const loadOptions = () => {
        console.log('Loading options') // Debugging log
        return axios
            .get('/api/v1/tsm/realms')
            .then(({ data }) => {
                console.log('API response:', data) // Debugging log
                return data.items.map((realm: Realm) => ({
                    label: `${realm.name} (${realm.gameVersion})`,
                    value: realm.realmId,
                }))
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                return []
            })
    }

    // useEffect(() => {
    //     fetchRealms()
    // }, [])

    // console.log({ realms })

    return (
        <AsyncSelect
            // cacheOptions
            loadOptions={loadOptions}
            // defaultOptions
            noOptionsMessage={() => 'No options'}
            loadingMessage={() => 'Loading...'}
        />
    )
}

export default RealmPicker
