import { RANKING_CLASS, RANKING_SPEC } from '@/utils/constants'
import { getSpecIconIndex } from '@/utils/helpers'
import React from 'react'

interface RankingSpecIconProps {
    rankingClass: RANKING_CLASS
    rankingSpec: RANKING_SPEC
}

const RankingSpecIcon: React.FC<RankingSpecIconProps> = ({
    rankingClass,
    rankingSpec,
}) => {
    const iconSize = 36
    const specIndex = getSpecIconIndex(rankingClass, rankingSpec)

    const positionX = specIndex * iconSize

    const containerStyle = {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
        display: 'inline-block',
        backgroundImage: `url('/spec-icons.jpg')`,
        backgroundPosition: `-${positionX}px 0px`,
        backgroundSize: 'auto',
    }

    return <div style={containerStyle} />
}

export default RankingSpecIcon
