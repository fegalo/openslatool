
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
  });
  $('#inputIncidentListFile').on('change',function(e) {
   handle_file(e);
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
        $('<td>').text(item.desc)
    );
    $tr.appendTo('#incidentListTable tbody');
  });
}
/** Fill the availability info */
function fill_ava(list){
  var year=getValue('#year');
  var month=getValue('#month');
  var tag=getValue('#tag');
  
  var total_month = sla_calc_month_time(year,month);
  var kpis=sla_calc_kpis(list,tag,total_month)

  $('#numInc').val(kpis.num_inc);
  $('#totDTime').val(kpis.total_dtime);
  $('#maxDTime').val(kpis.max_dtime);
  $('#avail').val(kpis.availability + '%');
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

