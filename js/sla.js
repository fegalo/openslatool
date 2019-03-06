
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
function sla_calc_kpis(list,tag,month){
  var total_dtime=0;
  var num_inc=0;
  var max_dtime=0;
  var total_month = sla_calc_month_time(year,month);
  list.forEach(function(e) {
    if(($.inArray(tag,e.tags) != -1)&&(moment(e.start).month()==month-1)){
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
Calculate tags and number of incidents
*/
function sla_calc_tags(list,month){
  var total_dtime=0;
  var num_inc=0;
  var max_dtime=0;
  var total_month = sla_calc_month_time(year,month);
  var tags_list=new Map();
  list.forEach(function(e) {
    if(moment(e.start).month()==month-1){
      e.tags.forEach(function(t) {
        if(tags_list.has(t)){
          tags_list.set(t,tags_list.get(t)+1);
        }else{
          tags_list.set(t,1);
        }
      });
    }
  });
  sla_log_debug(tags_list);
  return tags_list;
}
/**
Calculate tags and times of incidents
*/
function sla_calc_tags_times(list,month){
  var total_dtime=0;
  var num_inc=0;
  var max_dtime=0;
  var total_month = sla_calc_month_time(year,month);
  var tags_list=new Map();
  list.forEach(function(e) {
    if(moment(e.start).month()==month-1){
      e.tags.forEach(function(t) {
        if(tags_list.has(t)){
          var tags_day=tags_list.get(t);
          tags_day.set(moment(e.start).date(),tags_day.get(moment(e.start).date())+sla_extract_time(e));
          //tags_list.set(t,tags_day);
        }else{
          var tags_day=createTagMonth();
          tags_day.set(moment(e.start).date(),tags_day.get(moment(e.start).date())+sla_extract_time(e));
          tags_list.set(t,tags_day);
        }
      });
    }
  });
  sla_log_debug(tags_list);
  return tags_list;
}
function createTagMonth(){
  return new Map([[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],[17,0],[18,0],[19,0],[20,0],[21,0],[22,0],[23,0],[24,0],[25,0],[26,0],[27,0],[28,0],[29,0],[30,0]]);
}
/**
Calculate the duration of an incident
*/
function sla_extract_time(inc){
  var start = moment(inc.start);
  var end = moment(inc.end);
  return end.diff(start, 'minutes')
}
