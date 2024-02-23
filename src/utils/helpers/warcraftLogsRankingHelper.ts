import { RANKING_CLASS } from '../constants'

const rankingClassColorMap = {
    [RANKING_CLASS.MAGE]: '#40C7EB',
    [RANKING_CLASS.WARRIOR]: '#C79C6E',
    [RANKING_CLASS.DRUID]: '#FF7D0A',
    [RANKING_CLASS.HUNTER]: '#A9D271',
    [RANKING_CLASS.PALADIN]: '#F58CBA',
    [RANKING_CLASS.PRIEST]: '#FFFFFF',
    [RANKING_CLASS.ROGUE]: '#FFF569',
    [RANKING_CLASS.SHAMAN]: '#0070DE',
    [RANKING_CLASS.WARLOCK]: '#8787ED',
}

export const getRankingClassColor = (rankingClass: RANKING_CLASS): string => {
    return rankingClassColorMap[rankingClass] || '#FFFFFF'
}
