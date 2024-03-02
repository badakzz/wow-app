import React, { useEffect, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { RANKING_CLASS, RANKING_SPEC } from '@/utils/constants'
import { classToSpecMap } from '@/utils/helpers'

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

    return (
        <Select
            {...restOfProps}
            instanceId={'rankingSpecPicker'}
            options={options}
            value={selectedOption}
            onChange={onChange}
            isSearchable={false}
            classNamePrefix="react-select"
        />
    )
}

export default RankingSpecPicker
