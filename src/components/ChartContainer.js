import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const ChartContainer = ({ barChartData, pieChartData }) => {
  return (
    <div id="charts">
      <div className="chart">
        <Bar data={barChartData} />
      </div>
      <div className="chart">
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default ChartContainer;
