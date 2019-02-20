$( document ).ready(function() {
  console.log( "ready!" );
  main();
});

function main() {
  sample_dates();
  create_list();
  calc_total_time();
  calc_availability();
}
//vars
var list = [];
var total_time = 0;

function sample_dates(){
  var dateB = moment('2014-01-12 01:00');
  var dateC = moment('2014-01-11 00:00');

  console.log('Difference is ', dateB.diff(dateC), 'milliseconds');
  console.log('Difference is ', dateB.diff(dateC, 'days'), 'days');
  console.log('Difference is ', dateB.diff(dateC, 'months'), 'months');
  console.log('Difference is ', dateB.diff(dateC, 'minutes'), 'minutes');
}

function extract_time(inc){
  var start = moment(inc.start);
  var end = moment(inc.end);
  return end.diff(start, 'minutes')
}

function create_list(){
  var inc1 = {
    id: 'INC1',
    start: '2019-01-15 01:00',
    end: '2019-01-15 02:00',
    tags: ["back", "middle", "front"],
    desc: 'Incidence 1'
  };
  var inc2 = {
    id: 'INC2',
    start: '2019-01-15 03:00',
    end: '2019-01-15 05:00',
    tags: ["back"],
    desc: 'Incidence 2'
  };
  list=[inc1,inc2];
}
function calc_total_month(){
  var start = moment('2019-01-01 01:00');
  var end   = moment('2019-02-01 01:00');
  var month = end.diff(start, 'minutes')
  console.log('Month '+month);
  return month;
}
function calc_total_time(){
  total_time=0;
  list.forEach(function(e) {
    total_time+=extract_time(e)
  });
  console.log('TOTAL '+total_time);
  return total_time;
}
function calc_availability(){
  console.log(1-calc_total_time()/calc_total_month());
}
function fill_table(){
  $('#listTable tbody tr').remove();
  $.each(list, function(i, item) {
    var $tr = $('<tr>').append(
        $('<th>').text(item.id),
        $('<td>').text(item.start),
        $('<td>').text(item.end),
        $('<td>').text(item.tags),
        $('<td>').text(item.desc)
    ); //.appendTo('#records_table');
    $tr.appendTo('#listTable tbody');
    //console.log($tr.wrap('<p>').html());
});
}
