import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import "./pagination.scss";


const MyPagination = (props: any) => {
    const { page, pageCount, onChange } = props;
    return (
        <Stack spacing={2}>
            <Pagination
                page={page}
                count={pageCount}
                onChange={onChange}
            />
        </Stack>
    );
}

export default MyPagination;