import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LineGraph = ({ data }) => {
  const graphRef = useRef();

  useEffect(() => {
    // Clear any previous graph
    const svg = d3.select(graphRef.current);
    svg.selectAll("*").remove();

    // Dimensions
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };

    // Parse and process data
    const parsedData = data.map((d) => ({
      date: new Date(d.Date),
      weight: d.Weight,
    }));

    // Scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(parsedData, (d) => d.weight) + 10]) // Add buffer
      .range([height - margin.bottom, margin.top]);

    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.weight));

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.timeFormat("%b %d, %Y")))
      .selectAll("text")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add line path
    svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add points
    svg
      .selectAll(".dot")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.weight))
      .attr("r", 4)
      .attr("fill", "red");
  }, [data]);

  return <svg ref={graphRef} width={600} height={400}></svg>;
};

export default LineGraph;
