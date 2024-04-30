import React from "react";
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';




const DoughnutChart = (props: any) => {

    const { legend, analytics, colors, labels } = props;

    Chart.register(ArcElement, Tooltip, Legend, Title);
    Chart.defaults.plugins.legend.position = 'right';
    Chart.defaults.plugins.legend.title.display = true;
    Chart.defaults.plugins.legend.title.text = legend;


    const data = {
        labels: labels,
        datasets: [{
            data: analytics,
            backgroundColor: colors,
            borderWidth: 2,
            radius: '40%'
        }]
    };

    return <React.Fragment>
        <Doughnut data={data} />
    </React.Fragment>

}

export default DoughnutChart;