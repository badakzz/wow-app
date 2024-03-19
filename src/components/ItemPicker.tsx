import { FunctionComponent, useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import {
    DropdownIndicatorProps,
    OptionProps,
    SingleValueProps,
    components,
} from 'react-select'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { Image } from 'react-bootstrap'
import { ItemCharacteristics } from '.'
import { FaSearch } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'

type ItemPickerProps = {
    item: Item | null
    setItem: React.Dispatch<React.SetStateAction<Item | null>>
    selectRef?: React.RefObject<any>
} & any

const ItemPicker: React.FC<ItemPickerProps> = ({
    item,
    setItem,
    selectRef,
    ...restOfProps
}) => {
    const [currentItem, setCurrentItem] = useState<any>(null)

    const debouncedFetchItems = debounce(
        async (inputValue: string, callback: (options: any[]) => void) => {
            try {
                const response = await axios.get(
                    `/api/v2/items?hint=${encodeURIComponent(
                        inputValue
                    )}&limit=10`
                )
                const items = response.data

                const options = items.map((item: Item) => ({
                    label: item.itemName,
                    value: item.itemId,
                    rarity: item.itemRarity,
                    mediaUrl: item.mediaUrl,
                    item: item,
                }))

                callback(options)
            } catch (error) {
                console.error('Error fetching data:', error)
                callback([])
            }
        },
        200
    )

    useEffect(() => {
        if (item) {
            setCurrentItem({
                label: item.itemName,
                value: item.itemId,
                rarity: item.itemRarity,
                mediaUrl: item.mediaUrl,
                item: item,
            })
        }
    }, [item])

    const onChange = (selectedOption: any) => {
        if (selectedOption && selectedOption.item) {
            setItem(selectedOption.item)
        } else {
            setItem(null)
        }
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => {
        const tooltipId = `tooltip-option-${props.data.value}`

        return (
            <components.Option {...props}>
                <div className="d-flex gap-3">
                    <Image
                        src={props.data.mediaUrl}
                        alt="item-icon"
                        className="item-icon-sm"
                    />
                    <span
                        data-tooltip-id={tooltipId}
                        data-tooltip-float
                        style={{
                            color: getItemColorByRarity(props.data.rarity),
                        }}
                    >
                        {props.data.label}
                    </span>
                </div>
                <Tooltip id={tooltipId} className="tooltip-inner">
                    <ItemCharacteristics itemId={props.data.value} />
                </Tooltip>
            </components.Option>
        )
    }

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => (
        <components.SingleValue {...props}>
            <div className="d-flex gap-3">
                <Image
                    src={props.data.mediaUrl}
                    alt="item-icon"
                    className="item-icon-sm"
                />
                <span
                    style={{
                        color: getItemColorByRarity(props.data.rarity),
                    }}
                >
                    {props.data.label}
                </span>
            </div>
        </components.SingleValue>
    )

    const DropdownIndicator: FunctionComponent<DropdownIndicatorProps> = (
        props: any
    ) => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <FaSearch />
                </components.DropdownIndicator>
            )
        )
    }

    return (
        <AsyncSelect
            {...restOfProps}
            ref={selectRef}
            instanceId="itemPicker"
            loadOptions={debouncedFetchItems}
            noOptionsMessage={() => 'No item matching criteria found'}
            loadingMessage={() => 'Loading...'}
            placeholder="Search an item..."
            cacheOptions
            defaultOptions
            value={currentItem}
            onChange={onChange}
            isSearchable
            components={{ SingleValue, Option, DropdownIndicator }}
            classNamePrefix="react-select"
        />
    )
}

export default ItemPicker
