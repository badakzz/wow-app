import Select, { OptionProps, SingleValueProps, components } from 'react-select'
import { REGION, FLAG } from '../utils/constants'
import { FunctionComponent } from 'react'
import { Image } from 'react-bootstrap'

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

    const getFlagSrc = (props: any) =>
        `${FLAG[props.data.value as keyof typeof FLAG]}`

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <div className="d-flex align-items-center justify-content-center text-align-center gap-2">
                    <span>{props.data.label}</span>
                    <div className="logo-round-container">
                        <Image
                            src={getFlagSrc(props)}
                            style={{ height: '20px', width: 'auto' }}
                            alt="region logo"
                        />
                    </div>
                </div>
            </components.SingleValue>
        )
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex align-items-center gap-2">
                <span>{props.data.label}</span>
                <div className="logo-round-container">
                    <Image
                        src={getFlagSrc(props)}
                        style={{ height: '20px', width: 'auto' }}
                        alt="regionlogo"
                    />
                </div>
            </div>
        </components.Option>
    )

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
            components={{ SingleValue, Option }}
        />
    )
}

export default RegionPicker
