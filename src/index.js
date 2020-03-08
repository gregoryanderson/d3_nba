import $ from "jquery";
import Chart from "chart.js";
import "./css/base.scss";
import makeSpider from "./spiderChart";
import * as d3 from "d3";

$("#players__div").hide();
$("#radar__div").hide();

$("#submit-button").on("click", function(e) {
  e.preventDefault();

  var playerOneFirstName = $("#left__first-name").val();
  var playerOneLastName = $("#left__last-name").val();
  var playerTwoFirstName = $("#right__first-name").val();
  var playerTwoLastName = $("#right__last-name").val();

  var playerOneStats = fetch(
    // `https://nba-players.herokuapp.com/players-stats/${playerOneLastName}/${playerOneFirstName}`
    `https://nba-players.herokuapp.com/players-stats/james/lebron`
  ).then(function(response) {
    return response.json();
  });

  var playerTwoStats = fetch(
    // `https://nba-players.herokuapp.com/players-stats/${playerTwoLastName}/${playerTwoFirstName}`
    `https://nba-players.herokuapp.com/players-stats/tatum/jayson`
  ).then(function(response) {
    return response.json();
  });

  let playerData = { playerOne: {}, playerTwo: {} };

  Promise.all([playerOneStats, playerTwoStats])
    .then(function(values) {
      playerData["playerOne"] = values[0];
      playerData["playerTwo"] = values[1];
      return playerData;
    })
    .catch(error => console.log(`Error in promises ${error}`));

  setTimeout(function() {
    displayPlayers(playerData);
  }, 1000);
});

const displayPlayers = playerData => {
  $("#form").hide();
  $("#players__div").show();
  $("#radar__div").show();

  $("#players--name-one").text(playerData.playerOne.name);
  $("#players--name-two").text(playerData.playerTwo.name);
  $("#players--team-one").text(playerData.playerOne.team_name);
  $("#players--team-two").text(playerData.playerTwo.team_name);

  var dataset1 = [
    playerData.playerOne.points_per_game,
    playerData.playerOne.rebounds_per_game,
    playerData.playerOne.assists_per_game,
    playerData.playerOne.steals_per_game,
    playerData.playerOne.blocks_per_game
  ];

  var svgWidth1 = 300;
  var svgHeight1 = 150;
  var barPadding1 = 5;
  var barWidth1 = svgWidth1 / dataset1.length;
  var svg1 = d3
    .select(".players--p1-bar")
    .append("svg")
    .attr("width", svgWidth1)
    .attr("height", svgHeight1)
    .attr("class", "bar-chart");

  var barChart1 = svg1
    .selectAll("rect")
    .data(dataset1)
    .enter()
    .append("rect")
    .attr("y", function(d) {
      return svgHeight1 - d * 4;
    })
    .attr("height", function(d) {
      return d * 4;
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + d * 10 + ")";
    })
    .attr("width", barWidth1 - barPadding1)
    .attr("transform", function(d, i) {
      var translate = [barWidth1 * i, 0];
      return "translate(" + translate + ")";
    });

  var text1 = svg1
    .selectAll("text")
    .data(dataset1)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("y", function(d, i) {
      return svgHeight1 - d * 4 - 2;
    })
    .attr("x", function(d, i) {
      return barWidth1 * i;
    })
    .attr("fill", "orange")
    .attr("font-family", "sans-serif")
    .attr("text-align", "center");

  var dataset2 = [
    playerData.playerTwo.points_per_game,
    playerData.playerTwo.rebounds_per_game,
    playerData.playerTwo.assists_per_game,
    playerData.playerTwo.steals_per_game,
    playerData.playerTwo.blocks_per_game
  ];

  var svgWidth2 = 300;
  var svgHeight2 = 150;
  var barPadding2 = 5;
  var barWidth2 = svgWidth2 / dataset2.length;
  var svg2 = d3
    .select(".players--p2-bar")
    .append("svg")
    .attr("width", svgWidth2)
    .attr("height", svgHeight2)
    .attr("class", "bar-chart");

  var barChart2 = svg2
    .selectAll("rect")
    .data(dataset2)
    .enter()
    .append("rect")
    .attr("y", function(d) {
      return svgHeight1 - d * 4;
    })
    .attr("height", function(d) {
      return d * 4;
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + d * 20 + ")";
    })
    .attr("width", barWidth2 - barPadding2)
    .attr("transform", function(d, i) {
      var translate = [barWidth2 * i, 0];
      return "translate(" + translate + ")";
    });

  var text2 = svg2
    .selectAll("text")
    .data(dataset2)
    .enter()
    .append("text")
    .text(function(d) {
      return d;
    })
    .attr("y", function(d, i) {
      return svgHeight2 - d * 4 - 2;
    })
    .attr("x", function(d, i) {
      return barWidth2 * i;
    })
    .attr("fill", "orange")
    .attr("font-family", "sans-serif")
    .attr("text-align", "center");

  var gamesPlayed = parseInt(playerData.playerOne.games_played);
  var gamesSat = 60 - gamesPlayed;
  var dataset3 = [gamesPlayed, gamesSat];

  var svg3 = d3.select(".players--p1-pie").append("svg");
  var width3 = 200;
  var height3 = 100;
  var radius3 = Math.min(width3, height3) / 2;
  var g3 = svg3
    .append("g")
    .attr("transform", "translate(" + width3 / 2 + "," + height3 / 2 + ")");

  var color3 = d3.scaleOrdinal(["#4daf4a", "#377eb8"]);
  
  var pie3 = d3.pie();

  var arc3 = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius3);

  var arcs3 = g3
    .selectAll("arc")
    .data(pie3(dataset3))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs3
    .append("path")
    .attr("fill", function(d, i) {
      return color3(i);
    })
    .attr("d", arc3);

  var gamesPlayed2 = parseInt(playerData.playerTwo.games_played);
  var gamesSat2 = 60 - gamesPlayed;
  var dataset4 = [gamesPlayed2, gamesSat2];

  var svg4 = d3.select(".players--p2-pie").append("svg");
  var width4 = 200;
  var height4 = 100;
  var radius4 = Math.min(width4, height4) / 2;
  var g4 = svg4
    .append("g")
    .attr("transform", "translate(" + width4 / 2 + "," + height4 / 2 + ")");

  var color4 = d3.scaleOrdinal(["red", "purple"]);
  var pie4 = d3.pie();
  var arc4 = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius4);
  var arcs4 = g4
    .selectAll("arc")
    .data(pie4(dataset4))
    .enter()
    .append("g")
    .attr("class", "arc");
  arcs4
    .append("path")
    .attr("fill", function(d, i) {
      return color4(i);
    })
    .attr("d", arc4);

  makeSpider(playerData);

  // svg
  //   .selectAll("rect")
  //   .data(dataset)
  //   .enter()
  //   .append("rect")
  //   .attr("x", function(d, i) {
  //     return i * (w / dataset.length);
  //   })
  //   .attr("y", function(d) {
  //     return h - d * 4;
  //   })
  //   .attr("width", w / dataset.length - barPadding)
  //   .attr("height", function(d) {
  //     return d * 4;
  //   })
  //   .attr("fill", function(d) {
  //     return "rgb(0, 0, " + d * 10 + ")";
  //   });

  // svg
  //   .selectAll("text")
  //   .data(dataset)
  //   .enter()
  //   .append("text")
  //   .text(function(d) {
  //     return d;
  //   })
  //   .attr("text-anchor", "middle")
  //   .attr("x", function(d, i) {
  //     return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
  //   })
  //   .attr("y", function(d) {
  //     return h - d * 4 + 14;
  //   })
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "11px")
  //   .attr("fill", "white");
};

// var ctx1 = $("#players--p1-bar");
// var ctx2 = $("#players--p2-bar");
// var ctx3 = $("#players--p1-pie");
// var ctx4 = $("#players--p2-pie");
// var ctx5 = $("#radar");

// new Chart(ctx1, {
//   type: "bar",
//   data: {
//     labels: ["Points", "Assists", "Rebounds", "Steals", "Blocks"],
//     datasets: [
//       {
//         label: playerData.playerOne.name,
//         backgroundColor: "rgba(200,0,0,0.2)",
//         data: [
//           playerData.playerOne.points_per_game,
//           playerData.playerOne.rebounds_per_game,
//           playerData.playerOne.assists_per_game,
//           playerData.playerOne.steals_per_game,
//           playerData.playerOne.blocks_per_game
//         ]
//       },
//       {
//         label: "League Average",
//         backgroundColor: "rgba(0,0,200,0.2)",
//         data: [10, 6, 3, 1, 1]
//       }
//     ]
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//             suggestedMax: 30
//           }
//         }
//       ]
//     }
//   }
// });

// new Chart(ctx2, {
//   type: "bar",
//   data: {
//     labels: ["Points", "Assists", "Rebounds", "Steals", "Blocks"],
//     datasets: [
//       {
//         label: playerData.playerTwo.name,
//         backgroundColor: "rgba(200,0,0,0.2)",
//         data: [
//           playerData.playerTwo.points_per_game,
//           playerData.playerTwo.rebounds_per_game,
//           playerData.playerTwo.assists_per_game,
//           playerData.playerTwo.steals_per_game,
//           playerData.playerTwo.blocks_per_game
//         ]
//       },
//       {
//         label: "League Average",
//         backgroundColor: "rgba(0,0,200,0.2)",
//         data: [10, 6, 3, 1, 1]
//       }
//     ]
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//             suggestedMax: 30
//           }
//         }
//       ]
//     }
//   }
// });

// var gamesSatP1 = 60 - parseInt(playerData.playerOne.games_played);
// var gamesSatP2 = 60 - parseInt(playerData.playerTwo.games_played);

// new Chart(ctx3, {
//   type: "pie",
//   data: {
//     labels: ["Games Played", "Games Sat"],
//     datasets: [
//       {
//         data: [playerData.playerOne.games_played, gamesSatP1],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)"
//         ],
//         borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
//         borderWidth: 1
//       }
//     ]
//   },
//   options: {}
// });

// new Chart(ctx4, {
//   type: "pie",
//   data: {
//     labels: ["Games Played", "Games Sat"],
//     datasets: [
//       {
//         data: [playerData.playerTwo.games_played, gamesSatP2],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)"
//         ],
//         borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
//         borderWidth: 1
//       }
//     ]
//   },
//   options: {}
// });

// new Chart(ctx5, {
//   type: "radar",
//   data: {
//     labels: ["Points", "Assists", "Rebounds", "Steals", "Blocks"],
//     datasets: [
//       {
//         label: playerData.playerOne.name,
//         backgroundColor: "rgba(200,0,0,0.2)",
//         data: [
//           playerData.playerOne.points_per_game,
//           playerData.playerOne.rebounds_per_game,
//           playerData.playerOne.assists_per_game,
//           playerData.playerOne.steals_per_game,
//           playerData.playerOne.blocks_per_game
//         ]
//       },
//       {
//         label: playerData.playerTwo.name,
//         backgroundColor: "rgba(0,0,200,0.2)",
//         data: [
//           playerData.playerTwo.points_per_game,
//           playerData.playerTwo.rebounds_per_game,
//           playerData.playerTwo.assists_per_game,
//           playerData.playerTwo.steals_per_game,
//           playerData.playerTwo.blocks_per_game
//         ]
//       }
//     ]
//   }
// });
// };
