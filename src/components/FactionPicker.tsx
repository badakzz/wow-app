import Select from 'react-select'

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
        { value: 'Alliance', label: 'Alliance' },
        { value: 'Horde', label: 'Horde' },
        // { value: 'Neutral', label: 'Neutral' }
    ]

    console.log('yo')

    const selectedOption = options.find((option) => option.value === faction)

    const onChange = (newValue: any) => {
        if (newValue.value !== faction) setFaction(newValue.value)
    }

    return (
        <Select
            {...restOfProps}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
            defaultValue={options[0]}
        />
    )
}

export default FactionPicker
