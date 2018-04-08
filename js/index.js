function DrawGraph(parsedData){
    const margin = {
                  top:50, right:20, bottom:50, left:100 
                  },
          width = 800,
          height = 400;

    const minDate = new Date(parsedData[0][0]);
    const maxDate = new Date(parsedData[parsedData.length-1][0]);

    const xScale = d3.scaleTime()
                  .domain([minDate, maxDate])
                  .range([0, width]);

    const yScale = d3.scaleLinear()
                  .domain(d3.extent(parsedData, (d) => d[1]))
                  .range([height, 0]);

    const colorScale = d3.scaleLinear()
                      .domain(d3.extent(parsedData, (d) => d[1]))
                      .range(['black', 'blue']);


    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const tooltip = d3.select('body')
                    .append('div')
                    .styles({
                      'position': 'absolute',
                      'padding': '4px',
                      'background': 'white',
                      'boarder': '1px solid black',
                      'color': 'black'
                    });


    const svg = d3.select('body')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .styles({
                        'background-color': 'white',
                        'display': 'block',
                        'margin': 'auto'
                      })
                    .attr('class', 'graph-svg-component')
                    .append('g')
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const bars = svg.selectAll('rect')
                    .data(parsedData)
                    .enter()
                      .append('rect')
                      .attr('fill', (d) => colorScale(d[1]))
                      .attr('x', (d, i) => (i * (width / parsedData.length)))
                      .attr('y', (d) => yScale(d[1]))
                      .attr('width', (width / parsedData.length))
                      .attr('height', (d) => (height - yScale(d[1])))
                      .on('mouseover', mouseoverHandler)
                      .on('mousemove', mouseMovingHandler)
                      .on('mouseout', mouseoutHandler)


    svg.append('g') // x-axis
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis)
          .selectAll('text') // select the dates
          .style('text-anchor', 'end') // have them rotate from the ends instead of center
          .attr("transform", "rotate(-45)");

    svg.append('g') // y-axis
          .call(yAxis)
          .append('text')
            .style('fill', 'black') // fills the created text (default -> fill: none)
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .text("Billions of Dollars");

    function mouseoverHandler(d) {
      tooltip.transition()
        .style('opacity', 0.9);
      tooltip.style('left', `${(d3.event.pageX + 10)}px`)
        .style('top', `${(d3.event.pageY + 15)}px`)
        .html(`<p> Date: ${d[0]} </p> 
              <p> Billions: ${d[1]} </p>`);
      d3.select(this)
        .style('opacity', 0.1);
    }

    function mouseoutHandler(d) {
      tooltip.transition()
        .style('opacity', 0);
      d3.select(this)
        .style('opacity', 1);
    }

    function mouseMovingHandler(d) {
      tooltip.style("top", `${(d3.event.pageY - 10)}px`)
        .style("left", `${(d3.event.pageX + 10)}px`);
      d3.select(this)
        .style('opacity', 0.8);
    }

  };

  // call the data using d3.json and call the function DrawBar
    d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', 
            (rawData) => DrawGraph(rawData.data));