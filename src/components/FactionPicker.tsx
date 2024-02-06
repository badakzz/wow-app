import Select, { OptionProps, SingleValueProps, components } from 'react-select'
import { FACTION, FACTION_LOGO } from '../utils/constants'
import { FunctionComponent } from 'react'
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
    const options = [
        { value: FACTION.ALLIANCE, label: FACTION.ALLIANCE },
        { value: FACTION.HORDE, label: FACTION.HORDE },
        // { value: FACTION.NEUTRAL, label: FACTION.NEUTRAL },
    ]

    const selectedOption = options.find((option) => option.value === faction)

    const onChange = (newValue: any) => {
        if (newValue.value !== faction) setFaction(newValue.value)
    }

    const getFactionSrc = (props: any) =>
        `${FACTION_LOGO[props.data.value as keyof typeof FACTION_LOGO]}`

    const Option: FunctionComponent<OptionProps> = (props: any) => {
        console.log('val', props.data.value)
        return (
            <components.Option {...props}>
                <div className="d-flex align-items-center gap-2">
                    <span>{props.data.label}</span>
                    <div className="logo-round-container">
                        <Image
                            src={getFactionSrc(props)}
                            style={{ height: '20px', width: 'auto' }}
                            alt="region logo"
                        />
                    </div>
                </div>
            </components.Option>
        )
    }

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => (
        <components.SingleValue {...props}>
            <div className="d-flex align-items-center justify-content-center text-align-center gap-2">
                <span>{props.data.label}</span>
                <div className="logo-round-container">
                    <Image
                        src={getFactionSrc(props)}
                        style={{ height: '20px', width: 'auto' }}
                        alt="region logo"
                    />
                </div>
            </div>
        </components.SingleValue>
    )

    return (
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
    )
}

export default FactionPicker
