import * as d3 from "d3";

const makePie = playerData => {
  console.log(playerData);
  // var data = [];

  let data = [
    {
      Points: playerData.playerOne.points_per_game,
      Rebounds: playerData.playerOne.rebounds_per_game,
      Assists: playerData.playerOne.assists_per_game,
      Steals: playerData.playerOne.steals_per_game,
      Blocks: playerData.playerOne.blocks_per_game
    },
    {
      Points: playerData.playerTwo.points_per_game,
      Rebounds: playerData.playerTwo.rebounds_per_game,
      Assists: playerData.playerTwo.assists_per_game,
      Steals: playerData.playerTwo.steals_per_game,
      Blocks: playerData.playerTwo.blocks_per_game
    }
  ];
  let features = ["Points", "Rebounds", "Assists", "Steals", "Blocks"];

  let svg = d3
    .select("#radar")
    .append("svg")
    .attr("width", 600)
    .attr("height", 600);

  let radialScale = d3
    .scaleLinear()
    .domain([0, 30])
    .range([0, 250]);
  let ticks = [5, 10, 15, 20, 25, 30];

  ticks.forEach(t =>
    svg
      .append("circle")
      .attr("cx", 300)
      .attr("cy", 300)
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("r", radialScale(t))
  );

  ticks.forEach(t =>
    svg
      .append("text")
      .attr("x", 305)
      .attr("y", 300 - radialScale(t))
      .text(t.toString())
  );

  function angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return { x: 300 + x, y: 300 - y };
  }

  for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
    let line_coordinate = angleToCoordinate(angle, 30);
    let label_coordinate = angleToCoordinate(angle, 32);

    //draw axis line
    svg
      .append("line")
      .attr("x1", 300)
      .attr("y1", 300)
      .attr("x2", line_coordinate.x)
      .attr("y2", line_coordinate.y)
      .attr("stroke", "black");

    //draw axis label
    svg
      .append("text")
      .attr("x", label_coordinate.x)
      .attr("y", label_coordinate.y)
      .text(ft_name);
  }

  let line = d3
    .line()
    .x(d => d.x)
    .y(d => d.y);
  let colors = ["darkorange", "gray", "navy"];

  function getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }

  for (var i = 0; i < data.length; i++) {
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    //draw the path element
    svg
      .append("path")
      .datum(coordinates)
      .attr("d", line)
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
  }
};

export default makePie;
