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
        { value: 'Horde', label: 'Horde' },
        { value: 'Alliance', label: 'Alliance' },
        // { value: 'Neutral', label: 'Neutral' }
    ]

    const selectedOption = options.find((option) => option.value === faction)

    const onChange = (newValue: any) => {
        setFaction(newValue.value)
    }

    return (
        <Select
            {...restOfProps}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
        />
    )
}

export default FactionPicker
