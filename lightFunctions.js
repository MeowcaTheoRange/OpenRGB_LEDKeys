var intervals = [];

module.exports.intervals = intervals;

module.exports.fade = function (client, device, zone, color, settings) {
  var arrs = {...color};
  var clr = false;
  intervals[zone] = setInterval(() => {
    arrs.red -= color.red / settings.step;
    arrs.blue -= color.blue / settings.step;
    arrs.green -= color.green / settings.step;
    if (arrs.red <= 0 && arrs.blue <= 0 && arrs.green <= 0) clr = true;
    if (clr) clearInterval(intervals[zone]);
    client.updateSingleLed(device, zone, arrs);
  }, settings.interval);
}

module.exports.noop = function () {
  return false;
}