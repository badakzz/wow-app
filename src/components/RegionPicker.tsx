import Select, { OptionProps, SingleValueProps, components } from 'react-select'
import { REGION, FLAG } from '../utils/constants'
import { CSSProperties, FunctionComponent } from 'react'
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
    const options = Object.entries(REGION).map(([key, value]) => ({
        value,
        label: value,
    }))

    const getFlagSrc = (props: any) =>
        `${FLAG[props.data.value as keyof typeof FLAG]}`

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => (
        <components.SingleValue {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    width={24}
                    height={20}
                    src={getFlagSrc(props)}
                    alt="region logo"
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    )

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    width={24}
                    height={20}
                    src={getFlagSrc(props)}
                    alt="region logo"
                />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    )

    const selectedOption = options.find((option) => option.value === region)

    const onChange = (newValue: any) => {
        if (newValue.value !== region) setRegion(newValue.value)
    }

    return (
        <div style={styles.fixedWidthSm}>
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
        </div>
    )
}

const styles: { [key: string]: CSSProperties } = {
    fixedWidthSm: {
        width: '11rem',
    },
}

export default RegionPicker
