import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Select from '@material-ui/core/Select';

const SelectField = ({
    className,
    items,
    menuItemClassName,
    value,
    onChange,
}) => {
    console.log(value, "items");
    return (
        <Select
            className={className}
            displayEmpty={true}
            defaultValue={value}
            required={true}
            onChange={onChange}>
            <MenuItem
                key={0}
                className={menuItemClassName}
                value="">
                {'None'}
            </MenuItem>
            {
                items.map((item, index) => (
                    <MenuItem
                        key={index}
                        className={menuItemClassName}
                        value={item}>
                        {item}
                    </MenuItem>
                ))
            }
            {/*{*/}
            {/*    items.length > 1 && (*/}
            {/*        <MenuItem*/}
            {/*            key={-1}*/}
            {/*            className={menuItemClassName}*/}
            {/*            value="All">*/}
            {/*            All*/}
            {/*        </MenuItem>*/}
            {/*    )*/}
            {/*}*/}
        </Select>
    );
};


export default SelectField;
