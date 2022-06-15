'use strict';
const ioHook = require('iohook');
const { Client, utils } = require('openrgb-sdk');
var settings = require("./settings.json");
const { intervals, fade, noop } = require("./lightFunctions.js");
const prompts = require('prompts');

const client = new Client("Example", 6742, "localhost");
const timeout = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("ERROR ERROR THIS SHOULD NOT BE A VALID KEYBOARD MODEL");
  }, 2000);
});


(async () => {
	await client.connect();
  console.log("Connected to OpenRGB server");
  var unMatching = [];
  console.log("Checking for devices...");
  await new Promise((resolve, reject) => {
    var rep = 0;
    Object.entries(settings.devices).forEach(async ([key, val]) => {
      var ctr = await Promise.race([timeout, client.getControllerData(key)]);
      if (ctr.name != val) {
        unMatching.push(val + " (device " + key + ")");
      }
      rep++;
      if (rep >= Object.keys(settings.devices).length) resolve();
    });
  }).then(async () => {
    if (unMatching.length >= 1) {
      var quitPrg = await prompts({
        type: 'confirm',
        name: 'value',
        message: unMatching.length > 1 ? 
          ('The devices ' + unMatching.join(", ") + " are either not connected or are misplaced. Do you want to continue?") 
        : ('The device ' + unMatching[0] + " is either not connected or misplaced. Do you want to continue?"),
        initial: true
      });
      if (quitPrg) process.exit();
    }
    ioHook.on("keydown", event => {
      if (settings[event.keycode] != undefined)
        keyEventDef(settings[event.keycode]);
    });
    ioHook.start();
    console.log("Light handler has started.");
  })
})();

function keyEventDef(settings) {
  var zone = settings.zone;
  var device = settings.device;
  var col = { red: settings.red, green: settings.green, blue: settings.blue };
  if (Array.isArray(zone)) {
    zone.forEach((v) => {
      clearInterval(intervals[v]);
      client.updateSingleLed(device, v, col);
      if (settings.function)
        eval(settings.function)(client, device, v, col, settings.settings);
    })
  } else {
    clearInterval(intervals[zone]);
    client.updateSingleLed(device, zone, col);
    if (settings.function)
      eval(settings.function)(client, device, zone, col, settings.settings);
  }
}