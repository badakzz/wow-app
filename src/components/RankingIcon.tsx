import { RANKING_CLASS, RANKING_SPEC } from '@/utils/constants'
import { getClassIconIndex, getSpecIconIndex } from '@/utils/helpers'

type RankingIconProps = {
    rankingClass: RANKING_CLASS
    rankingSpec?: RANKING_SPEC
} & any

const RankingIcon: React.FC<RankingIconProps> = ({
    rankingClass,
    rankingSpec,
    ...restOfProps
}) => {
    const displayIconSize = 24
    const originalIconSize = 36
    const totalIcons = 81

    const scaledSpriteWidth =
        (displayIconSize / originalIconSize) * totalIcons * originalIconSize

    const specIndex = rankingSpec
        ? getSpecIconIndex(rankingClass, rankingSpec)
        : getClassIconIndex(rankingClass)

    const backgroundPositionX = -(specIndex * displayIconSize)

    const containerStyle = {
        width: `${displayIconSize}px`,
        height: `${displayIconSize}px`,
        display: 'inline-block',
        backgroundImage: 'url(/classes-and-specs-icons.jpg)',
        backgroundPosition: `${backgroundPositionX}px 0px`,
        backgroundSize: `${scaledSpriteWidth}px ${displayIconSize}px`,
        border: '1px solid grey',
    }

    return <div {...restOfProps} style={containerStyle}></div>
}

export default RankingIcon
