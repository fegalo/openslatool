$( document ).ready(function() {
  console.log( "ready!" );
  main();
  load_events();
});

function load_events() {
  $('#loadButton').on('click',function() {
   fill_table();
  });
  $('#calcButton').on('click',function() {
   fill_ava();
  });
  $('#inputFile').on('change',function(e) {
   handleFileSelect(e);
  });
}

function main() {
  sample_dates();
  create_list();
  calc_total_time();
  calc_availability();
}
//vars
var list = [];
var total_time = 0;
var incNumber = 0;
var totalTime=0;
var total_inc=0;
var max_inc=0;

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

function fill_ava(){
var total_month = calc_total_month();
var total_time= calc_total_time();
var ava= 1-total_time/total_month;
ava=Math.round(ava * 100 * 100) / 100
$('#totTime').val(total_time);
$('#maxTime').val(max_inc);
$('#incNumber').val(total_inc);
$('#avail').val(ava + '%');


}
function calc_total_month(){
  var year=$('#year').val()==null? $('#year').val() : $('#year').attr('placeholder');
  var month=$('#month').val()==null? $('#month').val() : $('#month').attr('placeholder');
  var start = moment(year+'-'+month+'-01 01:00');
  var end   = moment(year+'-'+(month+1)+'-01 01:00');
  var tmonth = end.diff(start, 'minutes')
  console.log('calc_total_month '+tmonth);
  return tmonth;
}
/*function calc_total_time(){
  total_time=0;
  var tag=
  list.forEach(function(e) {
    total_time+=extract_time(e)
  });
  console.log('TOTAL '+total_time);
  return total_time;
}*/
/*
function calc_total_month(){
  var start = moment('2019-01-01 01:00');
  var end   = moment('2019-02-01 01:00');
  var month = end.diff(start, 'minutes')
  console.log('Month '+month);
  return month;
}*/
function calc_total_time(){
  total_time=0;
  var tag ;
  if($('#tag').val()==null || $('#tag').val()=='' ){
    tag=$('#tag').attr('placeholder');
  }else{
    tag=$('#tag').val()
  }
  total_inc=0;
  max_inc=0;
  console.log('calc_total_time '+tag);
  list.forEach(function(e) {
    if($.inArray(tag,e.tags) != -1){
      var duration_time=extract_time(e);
      total_time+=duration_time;
      total_inc++;
      if(duration_time>max_inc){
        max_inc=duration_time;
      }
    }
  });
  console.log('calc_total_time '+total_time);
  return total_time;
}
function calc_availability(){
  console.log(1-calc_total_time()/calc_total_month());
  return 1-calc_total_time()/calc_total_month();
}


function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    console.log('handleFileSelect '+f.name);
    console.log('handleFileSelect '+f.type);
    console.log('handleFileSelect '+f.size);
    console.log('handleFileSelect '+f.name);
    var reader = new FileReader();
     // Closure to capture the file information.
     reader.onload = (function(theFile) {
       return function(e) {
         console.log(e.target.result);
         list=JSON.parse(e.target.result);
         fill_table();
       };
     })(f);
     // Read in the image file as a data URL.
     reader.readAsText(f);
  }


}
