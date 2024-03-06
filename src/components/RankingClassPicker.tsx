import Select, { OptionProps, SingleValueProps, components } from 'react-select'
import { RANKING_CLASS } from '../utils/constants'
import { FunctionComponent } from 'react'
import { getRankingClassColor } from '@/utils/helpers'

type RankingClassPickerProps = {
    rankingClass: string
    setRankingClass: React.Dispatch<React.SetStateAction<any>>
} & any

const RankingClassPicker: React.FC<RankingClassPickerProps> = ({
    rankingClass,
    setRankingClass,
    ...restOfProps
}) => {
    const options = Object.entries(RANKING_CLASS).map(([key, value]) => ({
        value,
        label: value,
    }))

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <span style={{ color: getRankingClassColor(props.data.label) }}>
                    {props.data.label}
                </span>
            </components.SingleValue>
        )
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <span style={{ color: getRankingClassColor(props.data.label) }}>
                {props.data.label}
            </span>
        </components.Option>
    )

    const selectedOption = options.find(
        (option) => option.value === rankingClass
    )

    const onChange = (newValue: any) => {
        if (newValue?.value !== rankingClass) setRankingClass(newValue?.value)
    }

    const customStyles = {
        indicatorSeparator: (provided: any) => ({
            ...provided,
            backgroundColor: 'var(--lightgrey) !important',
            marginRight: '0.8rem',
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused
                ? `${getRankingClassColor(rankingClass)} !important`
                : provided.borderColor,
            boxShadow: state.isFocused
                ? `0 0 0 1px ${getRankingClassColor(rankingClass)} !important`
                : provided.boxShadow,
            '&:hover': {
                borderColor: `${getRankingClassColor(rankingClass)} !important`,
            },
        }),
    }

    return (
        <Select
            {...restOfProps}
            instanceId={'rankingClassPicker'}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
            isClearable
            placeholder="Filter by class..."
            classNamePrefix="react-select"
            components={{ SingleValue, Option }}
            styles={customStyles}
        />
    )
}

export default RankingClassPicker
