import React, { FunctionComponent, useEffect, useState } from 'react'
import Select, {
    OptionProps,
    SingleValue,
    SingleValueProps,
    components,
} from 'react-select'
import { RANKING_CLASS, RANKING_SPEC } from '@/utils/constants'
import { classToSpecMap, getRankingClassColor } from '@/utils/helpers'
import { RankingIcon } from '.'

type RankingSpecProps = {
    rankingSpec: RANKING_SPEC
    setRankingSpec: React.Dispatch<React.SetStateAction<RANKING_SPEC | null>>
    rankingClass: RANKING_CLASS | null
} & any

const RankingSpecPicker: React.FC<RankingSpecProps> = ({
    rankingSpec,
    setRankingSpec,
    rankingClass,
    ...restOfProps
}) => {
    const [options, setOptions] = useState<
        { value: RANKING_SPEC; label: string }[]
    >([])

    useEffect(() => {
        if (rankingClass != null) {
            const specs: RANKING_SPEC[] =
                classToSpecMap[rankingClass as RANKING_CLASS]
            const newOptions = specs.map((spec) => ({
                value: spec,
                label: spec,
            }))
            setOptions(newOptions)
        } else {
            setOptions([])
        }
    }, [rankingClass])

    const onChange = (
        selectedOption: SingleValue<{ value: RANKING_SPEC; label: string }>
    ) => {
        setRankingSpec(selectedOption ? selectedOption.value : null)
    }

    const selectedOption = options.find(
        (option) => option.value === rankingSpec
    )

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => {
        return (
            <components.SingleValue {...props}>
                <div className="d-flex gap-2">
                    <RankingIcon
                        rankingClass={rankingClass}
                        rankingSpec={props.data.value}
                    />
                    <span
                        style={{
                            color: getRankingClassColor(rankingClass),
                        }}
                    >
                        {props.data.label}
                    </span>
                </div>
            </components.SingleValue>
        )
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div className="d-flex gap-2">
                <RankingIcon
                    rankingClass={rankingClass}
                    rankingSpec={props.data.value}
                />
                <span style={{ color: getRankingClassColor(rankingClass) }}>
                    {props.data.label}
                </span>
            </div>
        </components.Option>
    )

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
        <div style={{ width: '11rem' }}>
            <Select
                {...restOfProps}
                instanceId={'rankingSpecPicker'}
                placeholder={'Filter by spec...'}
                options={options}
                value={selectedOption}
                onChange={onChange}
                isSearchable={false}
                classNamePrefix="react-select"
                components={{ Option, SingleValue }}
                styles={customStyles}
            />
        </div>
    )
}

export default RankingSpecPicker
