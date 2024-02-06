import React, { FunctionComponent, useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async'
import { OptionProps, SingleValueProps, components } from 'react-select'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { Item } from '../utils/types'
import { getItemColorByRarity } from '../utils/helpers'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { ItemDetails } from '.'

type ItemPickerProps = {
    itemId: number | null
    setItemId: React.Dispatch<React.SetStateAction<number | null>>
}

const ItemPicker: React.FC<ItemPickerProps> = ({ itemId, setItemId }) => {
    const [currentItem, setCurrentItem] = useState<Item | null>(null)

    const debouncedFetchItems = debounce(
        async (inputValue: string, callback: (options: any[]) => void) => {
            try {
                const response = await axios.get<Item[]>(
                    `/api/v2/items?hint=${encodeURIComponent(
                        inputValue
                    )}&limit=10`
                )

                const options = response.data.map((result) => ({
                    label: result.itemName,
                    value: result.itemId,
                    rarity: result.itemRarity,
                }))
                callback(options)
            } catch (error) {
                console.error('Error fetching data:', error)
                callback([])
            }
        },
        200
    )

    const fetchItemsByName = (
        inputValue: string,
        callback: (options: any[]) => void
    ) => {
        debouncedFetchItems(inputValue, callback)
    }

    useEffect(() => {
        setCurrentItem(null)
    }, [])

    const onChange = (selectedOption: any) => {
        setItemId(selectedOption ? selectedOption.value : null)
        setCurrentItem(selectedOption)
    }

    const Option: FunctionComponent<OptionProps> = (props: any) => (
        <components.Option {...props}>
            <div
                style={{
                    color: getItemColorByRarity(props.data.rarity),
                }}
            >
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip className="item-tooltip">
                            <ItemDetails itemId={props.value} />
                        </Tooltip>
                    }
                >
                    <span>{props.label}</span>
                </OverlayTrigger>
            </div>
        </components.Option>
    )

    const SingleValue: FunctionComponent<SingleValueProps> = (props: any) => (
        <components.SingleValue {...props}>
            <div
                style={{
                    color: getItemColorByRarity(props.data.rarity),
                }}
            >
                {props.children}
            </div>
        </components.SingleValue>
    )

    return (
        <AsyncSelect
            instanceId="itemPicker"
            loadOptions={fetchItemsByName}
            noOptionsMessage={() => 'Unable to load items'}
            loadingMessage={() => 'Loading...'}
            placeholder="Search an item..."
            cacheOptions
            defaultOptions
            value={currentItem}
            onChange={onChange}
            isSearchable
            components={{ SingleValue, Option }}
            classNamePrefix="react-select"
        />
    )
}

export default ItemPicker
