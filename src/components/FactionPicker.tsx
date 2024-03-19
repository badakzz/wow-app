import Select, { OptionProps, SingleValueProps, components } from 'react-select'
import { FACTION, FACTION_LOGO } from '../utils/constants'
import { CSSProperties, FunctionComponent } from 'react'
import { Image } from 'react-bootstrap'

type FactionPickerProps = {
    faction: string
    setFaction: React.Dispatch<React.SetStateAction<any>>
} & any

const FactionPicker: React.FC<FactionPickerProps> = ({
    faction,
    setFaction,
    ...restOfProps
}) => {
    const options = Object.entries(FACTION).map(([key, value]) => ({
        value,
        label: value,
    }))

    const selectedOption = options.find((option) => option.value === faction)

    const onChange = (newValue: any) => {
        if (newValue.value !== faction) setFaction(newValue.value)
    }

    const getFactionSrc = (props: any) =>
        `${FACTION_LOGO[props.data.value as keyof typeof FACTION_LOGO]}`

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    width={20}
                    height={24}
                    src={getFactionSrc(props)}
                    alt="region logo"
                />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    )

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => (
        <components.SingleValue {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    width={20}
                    height={24}
                    src={getFactionSrc(props)}
                    alt="region logo"
                />
                <span>{props.data.label}</span>
            </div>
        </components.SingleValue>
    )

    return (
        <div style={styles.fixedWidthSm}>
            <Select
                {...restOfProps}
                isSearchable={false}
                instanceId={'factionPicker'}
                options={options}
                value={selectedOption}
                onChange={onChange}
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

export default FactionPicker
