// SLA Data
sla = null
const request = async () => {
  const response = await fetch('sla')
  sla = await response.json();
  sla = sla[0]
}
request();

// Charts colors
const chartColors = [
  (a=1) => `rgba( 54, 162, 235, ${a})`,
  (a=1) => `rgba( 75, 192, 192, ${a})`,
  (a=1) => `rgba(201, 203, 207, ${a})`,
  (a=1) => `rgba(255, 159,  64, ${a})`,
  (a=1) => `rgba(153, 102, 255, ${a})`,
  (a=1) => `rgba(255,  99, 132, ${a})`,
  (a=1) => `rgba(255, 205,  86, ${a})`
]

// This function loops for ever
function loop(charts) {
  fetch('top.csv') // Fetches data
  .then(response => response.text()) // Read it
  .then(data => data.split('\n').map(x => x.split(','))) // Divide in lines and lines in columns
  .then(data => {
    if (!charts) {
      paint(data);
    } else { //We already have charts, lets update values
      for (const chart of charts) {
        const index = chart.meta.index
        if (!chart) continue;
        chart.datasets[0].data = data.map(row => row[index]) // change the values
        chart.update() // update them
      }
    }
    return charts
  })
  .then(charts => {
    plot_lines()
    setTimeout(_ => loop(charts), 3000) // update every 3 seconds
  })
  .catch(error => {
    console.error('An error ocurred:', error)
  })
}
loop(null)

// Paint charts (should only run once)
function paint (data) {
  const headers = data[0].slice(1) // Remove the first header column (timestamp)
  // Remove headers line and the empty last one and grab the first 100
  data = data = data.slice(1, -1)

  // X Axis
  const xAxis = data.map((row, index) => index)

  // create a chart for each header
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
          pointRadius: 2 // dots' radius
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
              labelString: 'nth instruction'
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
        }
      }
    }

    // Disable effects/animations
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

    const chart = new Chart(canvas.getContext('2d'), options)
    chart.meta = { // recursion metadata
      index
    }
  })
}

// Plot lines over the charts
function plot_lines() {
  if (sla == null) return;
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
