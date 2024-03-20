import { CSSProperties, FunctionComponent } from 'react'
import AsyncSelect from 'react-select/async'
import axios from 'axios'
import { Raid } from '../utils/types'
import { OptionProps, SingleValueProps, components } from 'react-select'
import { Image } from 'react-bootstrap'
import { useToast } from '../utils/hooks'

type RaidPickerProps = {
    raid: Raid | null
    setRaid: React.Dispatch<React.SetStateAction<Raid | null>>
} & any

const RaidPicker: React.FC<RaidPickerProps> = ({
    raid,
    setRaid,
    ...restOfProps
}) => {
    const { showToast } = useToast()

    const fetchRaids = async () =>
        axios
            .post(`/api/v1/warcraftlogs/raids`, {
                operation: 'listRaids',
            })
            .then((response) => {
                const options = response.data.map(
                    (raid: { name: string; id: number }) => ({
                        label: raid.name,
                        value: raid.id,
                    })
                )
                if (options.length > 0 && !raid) setRaid(options[0])
                return options
            })
            .catch((error: any) => {
                showToast({ message: `Error fetching raids: ${error.message}` })
                return []
            })

    const onChange = (selectedOption: Raid) => {
        setRaid(selectedOption)
    }

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <div className="d-flex align-items-center justify-content-start gap-2">
                    <Image
                        src={`/raid-${props.data.value}.png`}
                        alt="raid-icon"
                        className="circular-icon"
                    />
                    <span>{props.data.label}</span>
                </div>
            </components.SingleValue>
        )
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <Image
                    src={`/raid-${props.data.value}.png`}
                    alt="raid-icon"
                    className="circular-icon"
                />
                <span>{props.data.label}</span>
            </div>
        </components.Option>
    )

    return (
        <AsyncSelect
            {...restOfProps}
            instanceId={'raidPicker'}
            loadOptions={fetchRaids}
            noOptionsMessage={() => 'No raid found'}
            loadingMessage={() => 'Loading...'}
            placeholder={'Select a raid...'}
            cacheOptions
            defaultOptions
            value={raid}
            onChange={onChange}
            isSearchable={false}
            classNamePrefix="react-select"
            key={`${raid?.id}`}
            components={{ SingleValue, Option }}
        />
    )
}

export default RaidPicker
