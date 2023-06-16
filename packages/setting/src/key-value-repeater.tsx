/**
 * Wordpress dependancies.
 */
import {
    __experimentalInputControl as InputControl,
    useBaseControlProps,
    FlexBlock,
    FlexItem,
    Flex,
    Button,
    BaseControl,
} from '@wordpress/components';
import { useCallback, useState, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import type { FC } from 'react';
type InputControlProps = import( '@wordpress/components/src/input-control/types' ).InputControlProps;
type BaseControlProps = import( '@wordpress/components/src/base-control/types' ).BaseControlProps;

/**
 * Internal dependancies.
 */
import { MergeTagsModalButton } from './merge-tags';
type MergeTagsProps = import( './types' ).MergeTagsProps;
type KeyValuePair = import( './types' ).KeyValuePair;
type keyValueRepeaterField = import( './types' ).keyValueRepeaterField;
type Setting = import( './types' ).Setting;

/**
 * Key value repeater fields.
 */
const keyValueRepeaterFields: keyValueRepeaterField[] = [
	{
		id: 'key',
		label: __( 'Key', 'hizzlewp' ),
		type: 'text',
	},
	{
		id: 'value',
		label: __( 'Value', 'hizzlewp' ),
		type: 'text',
	},
];

/**
 * Base props.
 */
type baseProps = {

	/**
	 * A single item.
	 */
	item: KeyValuePair;
}

/**
 * Field props.
 */
type fieldProps = baseProps & InputControlProps & {

	/**
	 * A single field.
	 */
	field: keyValueRepeaterField;

}

/**
 * Displays a single item's field in the repeater.
 */
const Field: FC<fieldProps> = ({ item, field, ...props }) => {

	const { label, type } = field;

	return (
		<FlexBlock>
			<InputControl
				type={type}
				label={label}
				placeholder={sprintf( __( 'Enter %s', 'hizzlewp' ), label )}
				className="hizzle-component__field hizzle-condition-field"
				__next36pxDefaultSize
				{ ...props }
			/>
		</FlexBlock>
	);
};

/**
 * Field props.
 */
type itemProps = baseProps & InputControlProps & {

	/**
	 * The current index.
	 */
	index: number;

	/**
	 * The item change handler.
	 */
	onItemChange: (item: KeyValuePair ) => void;

	/**
	 * The delete handler.
	 */
	onDelete: () => void;

	/**
	 * Sets the current field.
	 */
	setCurrentField: ([number, string]) => void;
}

/**
 * Displays a single Item in the repeater.
 */
const Item: FC<itemProps> = ({ item, index, onItemChange, onDelete, setCurrentField, ...props }) => {
	return (
		<Flex className="hizzle-repeater-item" wrap>

			{keyValueRepeaterFields.map((field) => (
				<Field
					key={`${field.id}__${index}`}
					item={item}
					field={field}
					value={item[field.id] === undefined ? '' : item[field.id]}
					onChange={(fieldValue) => onItemChange( {...item, [field.id]: fieldValue} )}
					onFocus={() => { setCurrentField([index, field.id])}}
					{...props}
				/>
			))}

			<FlexItem>
				<Button
					icon="trash"
					variant="tertiary"
					className="hizzle-component__field"
					label={__( 'Delete', 'hizzlewp' )}
					showTooltip
					onClick={onDelete}
				/>
			</FlexItem>
		</Flex>
	);
};

/**
 * Field props.
 */
interface repeaterProps extends Omit< BaseControlProps, 'children' > {

	/**
	 * The setting change handler.
	 */
	onChange: (items: KeyValuePair[] ) => void;

	/**
	 * The current value.
	 */
	value: KeyValuePair[];

	/**
	 * The current setting object.
	 */
	setting: Setting;

}

/**
 * Displays a key value repeater setting.
 *
 */
const KeyValueRepeater: FC<repeaterProps & MergeTagsProps> = ({ setting, availableSmartTags, value, onChange, ...attributes }) => {

	const [currentField, setCurrentField] = useState([0, 'key']);

	// On add merge tag...
	const onMergeTagClick = useCallback((mergeTag: string) => {

		if ( Array.isArray( currentField ) ) {
			value = [...value];
			value[currentField[0]][currentField[1]] += mergeTag;
			onChange(value);
		}
	}, [currentField, value, onChange]);

	// Merge tags suffix.
	const suffix = useMemo(() => (
		<MergeTagsModalButton availableSmartTags={ availableSmartTags } onMergeTagClick={ onMergeTagClick }/>
	), [availableSmartTags, onMergeTagClick]);

	// The base props.
	const { baseControlProps, controlProps } = useBaseControlProps( attributes );

	// Ensure the value is an array.
	if ( ! Array.isArray( value ) ) {
		value = [];
	}

	// Render the control.
	return (
		<BaseControl { ...baseControlProps }>

			<div { ...controlProps }>
				{value.map((item:KeyValuePair, index: number) => (
					<Item
						key={index}
						item={item}
						index={index}
						suffix={ suffix }
						onItemChange={(newValue: KeyValuePair) => {
							const newItems = [...value];
							newItems[index] = newValue;
							onChange(newItems);
						}}
						onDelete={() => {
							const newValue = [...value];
							newValue.splice(index, 1);
							onChange(newValue);
						}}
						setCurrentField={setCurrentField}
					/>
				))}
				<Button
					onClick={() => {
						const newValue = [...value];
						newValue.push({
							key: '',
							value: '',
						});
						onChange(newValue);
					}}
					variant="secondary"
				>
					{ setting.add_field ? setting.add_field : __( 'Add', 'hizzlewp' )}
				</Button>
			</div>

		</BaseControl>
	);
}

export default KeyValueRepeater;
