import Checkbox, { checkboxClasses } from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';

const MyCheckbox = (props: any) => {

    const { checked, register, onChange, label } = props;
    
    return (
        <div>
            <FormControlLabel
                control={
                    <Checkbox
                        {...register}
                        checked={!!checked}
                        onChange={onChange}
                        inputProps={{ 'aria-label': 'controlled checkbox' }}
                        sx={{
                            [`&, &.${checkboxClasses.checked}`]: {
                              color: '#e9611e',
                            },
                          }}
                    />
                }
                label={label || "No Label"}
            />
        </div>
    );
}

export default MyCheckbox;
