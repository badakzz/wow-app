import React from 'react'
import { RANKING_CLASS, RANKING_SPEC } from '@/utils/constants'
import { getSpecIconIndex } from '@/utils/helpers'

interface RankingSpecIconProps {
    rankingClass: RANKING_CLASS
    rankingSpec: RANKING_SPEC
}

const RankingSpecIcon: React.FC<RankingSpecIconProps> = ({
    rankingClass,
    rankingSpec,
}) => {
    const displayIconSize = 24
    const originalIconSize = 36
    const totalIcons = 81

    const scaledSpriteWidth =
        (displayIconSize / originalIconSize) * totalIcons * originalIconSize

    const specIndex = getSpecIconIndex(rankingClass, rankingSpec)
    const backgroundPositionX = -(specIndex * displayIconSize)

    const containerStyle = {
        width: `${displayIconSize}px`,
        height: `${displayIconSize}px`,
        display: 'inline-block',
        backgroundImage: 'url(/spec-icons.jpg)',
        backgroundPosition: `${backgroundPositionX}px 0px`,
        backgroundSize: `${scaledSpriteWidth}px ${displayIconSize}px`,
        border: '1px solid grey',
    }

    return <div style={containerStyle}></div>
}

export default RankingSpecIcon
