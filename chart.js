// SLA Data
var sla = null;
const request = async () => {
  const response = await fetch('sla');
  const json = await response.json();
  sla = json[0];
  console.log("sla data: ");
  console.log(sla);
}
request();

const chartColors = [
  (a=1) => `rgba( 54, 162, 235, ${a})`,
  (a=1) => `rgba( 75, 192, 192, ${a})`,
  (a=1) => `rgba(201, 203, 207, ${a})`,
  (a=1) => `rgba(255, 159,  64, ${a})`,
  (a=1) => `rgba(153, 102, 255, ${a})`,
  (a=1) => `rgba(255,  99, 132, ${a})`,
  (a=1) => `rgba(255, 205,  86, ${a})`
]

fetch('top.csv') // Open log
.then(response => response.text()) // Read it
.then(data => data.split('\n').map(x => x.split(','))) // Split in lines and split lines in columns
.then(data => {
  const n = 100 // Number of dots

  const headers = data[0].slice(1) // Remove the first header column (timestamp)
  // Remove headers line and the empty last one and grab the first 100
  data = data.slice(1, -1).slice(-n)

  // Time will be shown in seconds then we divide it by 1000
  //  before building the X axis
  const start = Math.round(data[0][0]/1000)
  const xAxis = data.map(row => Math.round(row[0]/1000) - start)

  // We will create a chart for each header:
  const charts = headers.map((header, index) => {
    const canvas = document.getElementById('chart-'+header)
    if (!canvas) return null
    const color = chartColors[index % chartColors.length]

    const options = {
      type: 'line',
      responsive: true,
      data: {
        labels: xAxis,
        datasets: [{
          label: header,
          data: data.map(row => row[index+1]), // Y axis
          backgroundColor: color(0.5),
          borderColor: color(),
          borderWidth: 1,
          pointRadius: 2 // Size of the dots
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 15,
            },
            scaleLabel: {
              display: true,
              labelString: 'seconds'
            }
          }],
          yAxes: [{
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8
            },
            scaleLabel: {
              display: true,
              labelString: header
            }
          }]
        },
        animation: {
          onComplete: function(animation) {
              plot_lines(animation)
          }
        }
      }
    }
    // If we have more than 200 dots then we deactivate lines and animations
    // to avoid slowing or crashing the dashboard
    if (n > 199) {
      options.options.elements = {
        line: {
          tension: 0
        }
      },
      options.options.animation = {
        duration: 0
      },
      options.options.hover = {
        animationDuration: 0
      },
      options.options.responsiveAnimationDuration = 0
    }

    return new Chart(canvas.getContext('2d'), options)
  })
  var charts_loaded = true;
  return charts
})
.then(charts => {
  console.log('done', charts)
})
.catch(error => {
  console.error('An error ocurred:', error)
})

function plot_lines (animation) {
  var execTime_line = new Graph({
    canvasId: 'chart-execTime (ms)',
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    unitsPerTick: 1
  });
  execTime_line.drawEquation(function(x) {
    return sla.maxExecTime;
  }, 'green', 1);

  var accuracy_line = new Graph({
    canvasId: 'chart-Accuracy (%)',
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    unitsPerTick: 1
  });
  accuracy_line.drawEquation(function(x) {
    return sla.minAccuracy;
  }, 'green', 1);

  var cost_line = new Graph({
    canvasId: 'chart-cost',
    minX: -10,
    minY: -10,
    maxX: 10,
    maxY: 10,
    unitsPerTick: 1
  });
  cost_line.drawEquation(function(x) {
    return sla.maxCost;
  }, 'green', 1);
}
