
$( document ).ready(function() {
  load_events();
  main();
});

// -----------------------
// MAIN
// -----------------------
var incidents_list = [];

function main() {
  create_default_list();
  fill_table(incidents_list);
  create_sample_chart();//sample
  create_sample_chart2();
}

/** Create a default list of incidents */
function create_default_list(){
  var inc1 = {
    id: 'INC1',
    start: '2019-01-15 01:00',
    end: '2019-01-15 02:00',
    tags: ["back", "middle", "front"],
    desc: 'Incident 1'
  };
  var inc2 = {
    id: 'INC2',
    start: '2019-01-15 03:00',
    end: '2019-01-15 05:00',
    tags: ["back"],
    desc: 'Incident 2'
  };
  incidents_list=[inc1,inc2];
}
// -----------------------
// EVENTS
// -----------------------
/**Prepare the event functions*/
function load_events() {
  $('#loadIncidentListButton').on('click',function() {
   create_default_list();
   fill_table(incidents_list);
  });
  $('#calcButton').on('click',function() {
   fill_ava(incidents_list);
   fill_charts(incidents_list);
  });
  $('#inputIncidentListFile').on('change',function(e) {
   handle_file(e);
  });
  $('#inputIncidentListFileCSV').on('change',function(e) {
   handle_file_csv(e);
  });
}

/** Fill the incidents table */
function fill_table(list){
  $('#incidentListTable tbody tr').remove();
  $.each(list, function(i, item) {
    var $tr = $('<tr>').append(
        $('<th>').text(item.id),
        $('<td>').text(item.start),
        $('<td>').text(item.end),
        $('<td>').text(item.tags),
        $('<td>').text(item.desc).addClass("d-none d-sm-table-cell")
    );
    $tr.appendTo('#incidentListTable tbody');
  });
}
/** Fill the availability info */
function fill_ava(list){
  var year=getValue('#year');
  var month=getValue('#month');
  var tag=getValue('#tag');

  var kpis=sla_calc_kpis(list,tag,month)

  $('#numInc').val(kpis.num_inc);
  $('#totDTime').val(kpis.total_dtime);
  $('#maxDTime').val(kpis.max_dtime);
  $('#avail').val(kpis.availability + '%');
}
/** Fill charts*/
function fill_charts(list){
  if(!$('#chartsDiv').hasClass('show'))
  {
    sla_log_debug('chartsDiv hidden')
    return;
  }
  var year=getValue('#year');
  var month=getValue('#month');

  var tags_map=sla_calc_tags(list,month);
  create_chart(tags_map);
  var tags_times_map=sla_calc_tags_times(list,month);
  create_chart2(tags_times_map);
}
/** Handle files */
function handle_file(evt) {
  var files = evt.target.files;
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        incidents_list=JSON.parse(e.target.result);
        fill_table(incidents_list);
       };
     })(f);
    reader.readAsText(f);
  }
}
function handle_file_csv(evt) {
  var files = evt.target.files;
  for (var i = 0, f; f = files[i]; i++) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        incidents_list=csv_parser(e.target.result);
        fill_table(incidents_list);
       };
     })(f);
    reader.readAsText(f);
  }
}
function csv_parser(csv_list){
  var lines=csv_list.split('\n');
  var incidents_list=[];
  for(var i=1;i < lines.length;i++){
      sla_log_debug(lines[i])
    var fields=lines[i].split(',');
    if(fields.length<5){
      continue;
    }
    var inc={
     "id": fields[0].substr(1,fields[0].length-2),
     "start": fields[1].substr(1,fields[1].length-2),
     "end": fields[2].substr(1,fields[2].length-2),
     "tags": fields[3].substr(1,fields[3].length-2).split(';'),
     "desc": fields[4].substr(1,fields[4].length-2),
    }
    incidents_list[i-1]=inc;

  }
  return incidents_list;
}
/** Get the value from a form field */
function getValue(id){
  var value ;
  if($(id).val()==null || $(id).val()=='' ){
    value=$(id).attr('placeholder');
  }else{
    value=$(id).val()
  }
  return value;
}
//charts
function create_chart(tags){
//remove previous
$('#myChart').remove();
$('#canvasDiv').append('<canvas id="myChart" width="400" height="400"></canvas>');

var ctx = document.getElementById("myChart").getContext('2d');
var tag_entries =  Array.from(tags.entries());
var tag_values =  Array.from(tags.values());
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: tag_entries,
        datasets: [{
            label: '# of Incidents',
            data: tag_values,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}
function create_chart2(tags){
  $('#myChart2').remove();
  $('#canvasDiv2').append('<canvas id="myChart2" width="400" height="400"></canvas>');

  var tag_keys =  Array.from(tags.keys());
  var dataset=[];
  var colors=["#3e95cd","#8e5ea2","#3cba9f"];
  tag_keys.forEach(function(key,i) {
    dataset[i]={
      "data" : Array.from(tags.get(key).values()),
      "label": key,
      "borderColor": colors[i%colors.length],
      "fill": false
    }
    var data=Array.from(tags.get(key).values());
    var label= key;
  });
  var tag_values =  Array.from(tags.values());

  var ctx = document.getElementById("myChart2").getContext('2d');
  var myLineChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        datasets: dataset
      },
      options: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    });
}
//sample charts
function create_sample_chart(){
var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Back", "Middle", "Front", "Network", "Release", "Capacity"],
        datasets: [{
            label: '# of Incidents',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}


function create_sample_chart2(){
  $('#myChart2').remove();
  $('#canvasDiv2').append('<canvas id="myChart2" width="400" height="400"></canvas>');

  var ctx = document.getElementById("myChart2").getContext('2d');
  var myLineChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
        datasets: [{
            data: [1,2,33,42,5,36,71,8,39,10,1,2,3,44,5,6,7,6,9,5,1,2,3,4,5,6,7,8,9,10],
            label: "Back",
            borderColor: "#3e95cd",
            fill: false
          }, {
            data: [1,22,33,42,5,36,71,7,32,10,1,22,33,42,5,36,71,7,32,10,1,22,33,42,5,36,71,7,32,10],
            label: "Middle",
            borderColor: "#8e5ea2",
            fill: false
          }, {
            data: [15,22,83,4,5,16,71,73,32,30,5,22,83,14,5,16,71,23,32,60,15,22,33,4,5,14,71,73,32,60],
            label: "Front",
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    });
}
