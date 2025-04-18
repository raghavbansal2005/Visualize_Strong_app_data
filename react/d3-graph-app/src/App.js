import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ExerciseChart = () => {
  const [chartData, setChartData] = useState(null);
  const [title, setTitle] = useState(null);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [exercises, setExercises] = useState({});
  const [selectedExercise, setSelectedExercise] = useState("12"); // Default to exercise ID 12

  useEffect(() => {
    // Fetch available exercises
    fetch("http://127.0.0.1:5000/data/excercises")
      .then((response) => response.json())
      .then((data) => setExercises(data))
      .catch((error) => console.error("Error fetching exercises:", error));
  }, []);

  useEffect(() => {
    if (!selectedExercise) return;

    fetch(`http://127.0.0.1:5000/data/excercises/${selectedExercise}`)
      .then((response) => response.json())
      .then((data) => {
        const exerciseData = data[data["name"]];

        const aggregatedData = exerciseData.map(({ Date: dateString, Reps, Weight }) => {
          const date = new Date(dateString).toLocaleDateString();
          // const data = Weight * (1 + Math.log(Reps)); // Log formula
          const data = Weight * Reps // simple multiplication formaula
          return { date, data, Weight, Reps };
        });

        setAggregatedData(aggregatedData);
        setTitle(data["name"] || "Exercise Progress");

        setChartData({
          labels: aggregatedData.map((item) => item.date),
          datasets: [
            {
              label: "Training Score",
              data: aggregatedData.map((item) => item.data),
              borderColor: "rgba(153, 102, 255, 1)",
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              tension: 0.4,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedExercise]);

  return (
    <div>
      <h2>{title}</h2>
      <label>Select Exercise: </label>
      <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
        {Object.entries(exercises).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: title || "Exercise Progress" },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    const index = tooltipItem.dataIndex;
                    const { Weight, Reps } = aggregatedData[index];
                    return `TIS: ${tooltipItem.raw.toFixed(2)} (Weight: ${Weight} lbs, Reps: ${Reps})`;
                  },
                },
              },
            },
            scales: {
              y: { title: { display: true, text: "Training Intensity Score (TIS)" } },
              x: { title: { display: true, text: "Date" } },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ExerciseChart;