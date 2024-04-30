import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import { useState } from 'react';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file


const MyDateRangePicker = (props) => {

    const {value,onChange } = props;

    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);


    return <DateRange
        editableDateInputs={true}
        onChange={onChange}
        moveRangeOnFirstSelection={false}
        ranges={value}
    />
}

export default MyDateRangePicker;