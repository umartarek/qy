frappe.pages['google'].on_page_load = function(wrapper) {
  // Create the page
  var page = frappe.ui.make_app_page({
      parent: wrapper,
      title: 'Google Pie Chart Example',
      single_column: true
  });

  // Add a div for the chart
  $(page.body).append('<div id="chart_div" style="width: 100%; height: 500px;"></div>');

  // Load Google Charts Library
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/charts/loader.js';
  script.onload = function() {
      // Initialize Google Charts
      google.charts.load('current', {packages: ['corechart']});
      google.charts.setOnLoadCallback(drawChart);
  };
  script.onerror = function() {
      frappe.msgprint(__('Failed to load Google Charts library.'));
  };
  document.head.appendChild(script);

  // Fetch data from your API and render the chart
  function fetchDataAndDrawChart() {
      frappe.call({
          method: "qyass.api.data2.get_all_qyass_emp_dailywork",  // Your API method
          callback: function(response) {
              if (response.message.status === 'success' && response.message.data) {
                  // Prepare the data for the chart
                  const apiData = response.message.data;
                  const chartData = [['Employee', 'Progress']];
                  
                  // Loop through the API data and create an array for the chart
                  apiData.forEach(function(item) {
                      const employeeName = item.employee;
                      let totalProgress = 0;
                      let tasksCount = 0;
                      
                      // Aggregate the progress of each task for the employee
                      item.child_table.forEach(function(task) {
                          totalProgress += task.progress;
                          tasksCount++;
                      });
                      
                      // Calculate average progress for the employee
                      const averageProgress = tasksCount > 0 ? totalProgress / tasksCount : 0;
                      chartData.push([employeeName, averageProgress]);
                  });

                  // Draw the pie chart
                  drawPieChart(chartData);
              } else {
                  frappe.msgprint(__('No data found.'));
              }
          },
          error: function(error) {
              frappe.msgprint(__('Error fetching data.'));
          }
      });
  }

  // Function to draw the Pie chart
  function drawPieChart(chartData) {
      const data = google.visualization.arrayToDataTable(chartData);

      const options = {
          title: 'Employee Task Progress',
          pieSliceText: 'percentage',
          slices: {
              0: { offset: 0.1 },
              1: { offset: 0.1 },
              2: { offset: 0.1 }
          },
          legend: { position: 'bottom' }
      };

      const chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
  }

  // Fetch the data and draw the chart
  fetchDataAndDrawChart();
};
