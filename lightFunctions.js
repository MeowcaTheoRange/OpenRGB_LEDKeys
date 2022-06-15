var lerp = require('lerp');
var { easings } = require("./eases.js");
var intervals = [];

module.exports.intervals = intervals;

module.exports.anims = {
  fadeOut (client, device, zone, color, settings) {
    var time = Date.now();
    var arrs = {...color};
    var clr = false;
    intervals[zone] = setInterval(() => {
      arrs.red = lerp(color.red, 0, easings[settings.ease]((Date.now() - time) / settings.time));
      arrs.blue = lerp(color.blue, 0, easings[settings.ease]((Date.now() - time) / settings.time));
      arrs.green = lerp(color.green, 0, easings[settings.ease]((Date.now() - time) / settings.time));
      if (clr) clearInterval(intervals[zone]);
      client.updateSingleLed(device, zone, arrs);
    }, 50);
  },
  fadeIn (client, device, zone, color, settings) {
    var time = Date.now();
    var arrs = {...color};
    var clr = false;
    intervals[zone] = setInterval(() => {
      arrs.red = lerp(0, color.red, easings[settings.ease]((Date.now() - time) / settings.time));
      arrs.blue = lerp(0, color.blue, easings[settings.ease]((Date.now() - time) / settings.time));
      arrs.green = lerp(0, color.green, easings[settings.ease]((Date.now() - time) / settings.time));
      if (clr) clearInterval(intervals[zone]);
      client.updateSingleLed(device, zone, arrs);
    }, 50);
  },
  noop (client, device, zone, color) {
    client.updateSingleLed(device, zone, color);
  }
}