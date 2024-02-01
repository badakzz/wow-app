import Select from 'react-select'
import { REGION } from '../utils/constants'

type RegionPickerProps = {
    region: string
    setRegion: React.Dispatch<React.SetStateAction<any>>
} & any

const RegionPicker: React.FC<RegionPickerProps> = ({
    region,
    setRegion,
    ...restOfProps
}) => {
    const options = [
        { value: REGION.EUROPE, label: REGION.EUROPE },
        { value: REGION.KOREA, label: REGION.KOREA },
        { value: REGION.NORTH_AMERICA, label: REGION.NORTH_AMERICA },
        { value: REGION.TAIWAN, label: REGION.TAIWAN },
    ]

    const selectedOption = options.find((option) => option.value === region)

    const onChange = (newValue: any) => {
        if (newValue.value !== region) setRegion(newValue.value)
    }

    return (
        <Select
            {...restOfProps}
            instanceId={'regionPicker'}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
            classNamePrefix="react-select"
        />
    )
}

export default RegionPicker
