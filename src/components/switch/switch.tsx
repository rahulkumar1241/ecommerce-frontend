import * as React from 'react';
import Switch from '@mui/material/Switch';

const ControlledSwitches = (props: any) => {
    const { checked, handleChange } = props;
 

    return (
        <div className='d-flex'>
            <Switch
                checked={checked }
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
                color="warning"
            />
        </div>
    );
}

export default ControlledSwitches;