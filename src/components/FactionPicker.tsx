import Select from 'react-select'
import { FACTION } from '../utils/constants'

type FactionPickerProps = {
    faction: string
    setFaction: React.Dispatch<React.SetStateAction<any>>
} & any

const FactionPicker: React.FC<FactionPickerProps> = ({
    faction,
    setFaction,
    ...restOfProps
}) => {
    const options = [
        { value: FACTION.ALLIANCE, label: FACTION.ALLIANCE },
        { value: FACTION.HORDE, label: FACTION.HORDE },
    ]

    const selectedOption = options.find((option) => option.value === faction)

    const onChange = (newValue: any) => {
        if (newValue.value !== faction) setFaction(newValue.value)
    }

    return (
        <Select
            {...restOfProps}
            instanceId={'factionPicker'}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
            classNamePrefix="react-select"
        />
    )
}

export default FactionPicker
