import React from 'react';

/**
 * Item of the list.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function ListItem(props) {
    return <li>{props.value.code + ' ' + props.value.dateTime}</li>;
}

/**
 * List of the available game saves.
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
export default function SavesList(props) {
    const saves = props.saves;
    const listItems = saves.map((save) =>
        <ListItem key={save.code.toString()}
                  value={save} />
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}