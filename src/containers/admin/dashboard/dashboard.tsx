import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Loading from "../../../components/loader/loader";
import showToast from "../../../components/toasters/toast";
import { getDashboardData } from "../../../store/slices/admin";
import "./dashboard.scss";
import CountUp from 'react-countup';
import DoughnutChart from "../../../components/charts/doughnutchart";
import { getRandomColor } from "../../../constants/constants";




const Dashboard = () => {

    const dispatch = useAppDispatch();

    const { dashboardData, loadingGetDashboardData } = useAppSelector(state => state.admin);


    const getDashboardDataFunc = async () => {
        let response = await dispatch(getDashboardData({}));
        let analyticsData = response?.payload?.data ? response.payload.data : {};
        if (analyticsData.success) {
            window.scrollTo(0, 0);
        } else {
            showToast('ERROR', analyticsData.message || 'Some Error Occurred...');
        }
    }




    useEffect(() => {
        getDashboardDataFunc();
    }, [])

    return <React.Fragment>
        {loadingGetDashboardData ? <Loading loading={true} /> : ""}
        <div className="mt-3 admin-dashboard">
            <div className="row d-flex justify-content-center">
                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2" >
                    <div className="analytics-card">
                        <p className="title">Total Orders</p>

                        <p className="value">
                            {dashboardData?.order_count ? <CountUp start={0} end={dashboardData?.order_count} duration={3} /> : 0}
                        </p>

                    </div>
                </div>

                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2" >
                    <div className="analytics-card">
                        <p className="title">Items Ready to Ship</p>
                        <p className="value">
                            {dashboardData?.items_ready_to_ship ? <CountUp start={0} end={dashboardData?.items_ready_to_ship} duration={3} /> : 0}
                        </p>
                    </div>
                </div>


                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2" >
                    <div className="analytics-card">
                        <p className="title">Items Shipped</p>
                        <p className="value">
                            {dashboardData?.items_shipped ? <CountUp start={0} end={dashboardData?.items_shipped} duration={3} /> : 0}
                        </p>
                    </div>
                </div>

                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                    <div className="analytics-card">
                        <p className="title">Items Delivered</p>
                        <p className="value">
                            {dashboardData?.items_delivered ? <CountUp start={0} end={dashboardData?.items_delivered} duration={3} /> : 0}
                        </p>

                    </div>
                </div>

                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2" >
                    <div className="analytics-card">
                        <p className="title">Items Cancelled</p>
                        <p className="value">
                            {dashboardData?.items_cancelled ? <CountUp start={0} end={dashboardData?.items_cancelled} duration={3} /> : 0}
                        </p>

                    </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
                    <div className="analytics-card">
                        <p className="title">Items Returned</p>
                        <p className="value">
                            {dashboardData?.items_return ? <CountUp start={0} end={dashboardData?.items_return} duration={3} /> : 0}
                        </p>
                    </div>
                </div>


                <div className="col-12 mt-3 d-flex align-items-center amount-section">
                    <span>Total Amount : </span>{dashboardData?.total_amount ? <span className="amount"><CountUp prefix="₹" start={0} end={dashboardData?.total_amount} duration={3} /> </span>: 0}
                </div>

                <div className="col-12" style={{ marginTop: "-350px" }}>
                    <DoughnutChart
                        legend="Category Wise Order Data"

                        labels={dashboardData?.category_wise_data ? dashboardData.category_wise_data.map((value: any) => {
                            return value.category_name
                        }) : []}

                        analytics={dashboardData?.category_wise_data ? dashboardData.category_wise_data.map((value: any) => {
                            return value.count
                        }) : []}

                        colors={dashboardData?.category_wise_data ? dashboardData.category_wise_data.map((value: any) => {
                            return getRandomColor()
                        }) : []}
                    />
                </div>
            </div>


        </div>

    </React.Fragment>
}

export default Dashboard;