
function sla_log_info(msg){
  var format='%c %s: %s '
  if(typeof msg === 'Object'){
    format='%c %s: %o ';
  }
  console.log( format, 'color: orange; background-color: black;', sla_log_info.caller.name, msg);
}
function sla_log_debug(msg){
  var format='%c %s: %s '
  if(typeof msg === 'Object'){
    format='%c %s: %o ';
  }
  console.log( format, 'color: yellow; background-color: black;', sla_log_debug.caller.name, msg);
}
/**
Calculate the total minutes of the month
*/
function sla_calc_month_time(year,month){
  var start = moment(year+'-'+month+'-01 00:00');
  var end=moment(start).add(1, 'M');
  var tmonth = end.diff(start, 'minutes')
  sla_log_debug(tmonth);
  return tmonth;
}
/**
Calculate the total minutes of the incidents
*/
function sla_calc_kpis(list,tag,total_month){
  var total_dtime=0;
  var num_inc=0;
  var max_dtime=0;
  list.forEach(function(e) {
    if($.inArray(tag,e.tags) != -1){
      var duration_time=sla_extract_time(e);
      total_dtime+=duration_time;
      num_inc++;
      if(duration_time>max_dtime){
        max_dtime=duration_time;
      }
    }
  });
  var ava= 1-total_dtime/total_month;
  ava=Math.round(ava * 100 * 100) / 100;
  var ret={
    "total_dtime": total_dtime,
    "num_inc": num_inc,
    "max_dtime": max_dtime,
    "availability": ava
  };
  sla_log_debug(ret);
  return ret;
}
/**
Calculate the duration of an incident
*/
function sla_extract_time(inc){
  var start = moment(inc.start);
  var end = moment(inc.end);
  return end.diff(start, 'minutes')
}
