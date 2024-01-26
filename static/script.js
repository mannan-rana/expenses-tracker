document.addEventListener('DOMContentLoaded', () => {
    const serverURL = window.location.origin; 
    const expenseForm = document.getElementById('expense-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const expenseList = document.getElementById('expense-list');
    const pieChartContainer = document.getElementById('pie-chart');
    const barChartContainer = document.getElementById('bar-chart');

    fetchExpenses();

    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const description = descriptionInput.value;
        const amount = amountInput.value;

        if (description && amount) {
            addExpense({ description, amount });
            descriptionInput.value = '';
            amountInput.value = '';
        } else {
            alert('Please fill in all fields');
        }
    });

    function addExpenseToList(description, amount) {
        const listItem = document.createElement('li');
        listItem.textContent = `${description}: (Є)${amount}`;
        expenseList.appendChild(listItem);
    }

    function addExpense(expense) {
        fetch(`${serverURL}/add-expense`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        })
        .then(response => response.json())
        .then(data => {
            addExpenseToList(data.description, data.amount);
            fetchExpenses();
        })
        .catch(error => console.error('Error:', error));
    }

    function fetchExpenses() {
        fetch(`${serverURL}/expenses`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            expenseList.innerHTML = '';
            data.forEach(expense => addExpenseToList(expense.description, expense.amount));
            renderCharts(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function renderBarChart(expenses) {
        barChartContainer.innerHTML = '';
    
        const chartWidth = 400;
        const chartHeight = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 40 };
        const width = chartWidth - margin.left - margin.right;
        const height = chartHeight - margin.top - margin.bottom;
    
        const paddingTop = 20;
    
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    
        const barSvg = d3.select('#bar-chart')
            .append('svg')
            .attr('width', chartWidth)
            .attr('height', chartHeight);
    
        const barGroup = barSvg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top + paddingTop})`);
    
        const x = d3.scaleBand()
            .domain(expenses.map(d => d.description))
            .range([0, width])
            .padding(0.1);
    
        const y = d3.scaleLinear()
            .domain([0, d3.max(expenses, d => d.amount) * 1.2])
            .nice()
            .range([height, 0]);
    
        barGroup.selectAll('.bar')
            .data(expenses)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.description))
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.amount))
            .attr('height', d => height - y(d.amount))
            .attr('fill', (d, i) => colorScale(i))
            .on('mouseover', function(d) {
                const tooltip = d3.select('#tooltip');
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`Amount: ${d.amount} Є`)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseover', function(d) {
                const tooltip = d3.select('#tooltip');
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`Amount: ${d.data.amount} Є`) // Accessing amount under data
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            
        barGroup.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'middle');
    
        barGroup.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).ticks(5));
    
        barGroup.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 5)
            .attr('text-anchor', 'middle')
            .text('Expense Description');
    
        barGroup.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -margin.left)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Amount (Є)');
    }
    
    function renderPieChart(expenses) {
        pieChartContainer.innerHTML = '';

        const containerWidth = pieChartContainer.clientWidth;
        const containerHeight = pieChartContainer.clientHeight;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        const radius = Math.min(width, height) / 2;

        const pieSvg = d3.select('#pie-chart')
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight)
            .append('g')
            .attr('transform', `translate(${containerWidth / 2}, ${containerHeight / 2})`);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const pie = d3.pie()
            .value(d => d.amount)
            .sort(null);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const arcs = pieSvg.selectAll('.arc')
            .data(pie(expenses))
            .enter().append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => colorScale(i % 10))
            .on('mouseover', function(d) {
                const tooltip = d3.select('#tooltip');
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`Amount: ${d.data.amount} Є`) // Accessing amount under data
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on('mouseout', function(d) {
                const tooltip = d3.select('#tooltip');
                tooltip.transition().duration(500).style('opacity', 0);
            });

        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('dy', '0.35em')
            .text(d => d.data.description);
    }

    function renderCharts(expenses) {
        renderBarChart(expenses);
        renderPieChart(expenses);
    }

    function downloadCharts(chartType) {
        const chartContainer = chartType === 'bar' ? barChartContainer : pieChartContainer;
        const chartSVG = chartContainer.querySelector('svg');
        const chartSVGData = new XMLSerializer().serializeToString(chartSVG);

        const downloadLink = document.createElement('a');
        
        downloadLink.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(chartSVGData));
        downloadLink.setAttribute('download', chartType === 'bar' ? 'bar_chart.svg' : 'pie_chart.svg');

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    const downloadBarChartButton = document.getElementById('download-bar');
    downloadBarChartButton.addEventListener('click', () => downloadCharts('bar'));
    
    const downloadPieChartButton = document.getElementById('download-pie');
    downloadPieChartButton.addEventListener('click', () => downloadCharts('pie'));
});