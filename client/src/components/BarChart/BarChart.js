import React from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import "./BarChart.css";

const BarChart = ({ score, status }) => {
  const state = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: `over all ${
          status === null ? "tweet sentiment analysis" : status
        }`,
        backgroundColor: "#19BBFD",
        borderColor: "gray",
        borderWidth: 1,
        data: score,
      },
    ],
  };

  const width = status === null ? "500px" : "800px";

  return (
    <Paper elevation={8} className="chart" sx={{ maxWidth: width }}>
      <Bar
        data={state}
        options={{
          title: {
            display: true,
            text: "Average Rainfall per month",
            fontSize: 20,
          },
          legend: {
            display: true,
            position: "right",
          },
        }}
      />
      <Typography variant="h6">All values are based on percentages</Typography>
    </Paper>
  );
};

export default BarChart;
