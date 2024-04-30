import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const MyDatatable = (props) => {

    const { columns, data } = props;

    return (
        <React.Fragment>
            <DataTable
                columns={columns}
                data={data}
                highlightOnHover
                striped={true}
            />
        </React.Fragment>
    )
}
export default MyDatatable;