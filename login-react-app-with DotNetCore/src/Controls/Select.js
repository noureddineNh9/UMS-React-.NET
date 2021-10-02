import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';
import React from 'react'

export default function Select(props) {
    const { name, value, label, variant, onChange, error = null, options } = props;

    return (
        <FormControl variant= { variant || "outlined" } { ...(error && {error: true }) } >
            <InputLabel > {label} </InputLabel>
            <MuiSelect label={label} name={name} value={value} onChange={onChange} >
                {
                    options.map( item => (
                            <MenuItem key={item.id} value={item.id}> {item.title} </MenuItem>
                    ))
                }
            </MuiSelect>
            { error && <FormHelperText>{error}</FormHelperText> }
        </FormControl>
    )
}
