const { Client, utils } = require('openrgb-sdk');
const fs = require("fs");
const ioHook = require('iohook');
const client = new Client("Example", 6742, "localhost");
const prompts = require('prompts');
(async () => {
  await client.connect();
  var count = await client.getControllerCount();
  var ctrarray = [];
  var ctrs = await client.getAllControllerData();
  var zones = [];
  ctrs.forEach((v, i) => {
    ctrarray.push({
      title: v.name,
      value: v.deviceId,
      disabled: v.zones <= 0
    })
    zones[i] = [];
    ctrs[i].leds.forEach((vv, ii) => {
      zones[i].push({
        title: vv.name,
        value: ii
      })
    })
  })
  console.log("Press a key to bind...");
  var keycodeJSWoo = null;
  ioHook.on("keydown", event => {
    if(keycodeJSWoo == null)
      keycodeJSWoo = event.keycode;
  });
  ioHook.start();
  waitFor(_ => keycodeJSWoo != null)
  .then(async _ => {
    var prevCols = {
      red: 255,
      green: 0,
      blue: 0
    };
    var sel = 0;
    var zon = [];
    var deviceIdentification = [];
    var response = await prompts([
      {
        type: 'select',
        name: 'device',
        message: 'Select the affected device',
        warn: "This device does not have any zones or LEDs.",
        style: 'default',
        choices: ctrarray,
        onState: async (state) => {
          sel = state.value;
          deviceIdentification = ctrarray[state.value].title
        }
      },
      {
        type: 'multiselect',
        name: 'zone',
        message: 'Select the affected zone',
        warn: "This device does not have any zones or LEDs.",
        style: 'default',
        choices: zones[sel],
        onState: async (state) => {
          zon = [];
          state.value.forEach((v, i) => {
            if (v.selected) {
              zon.push(v.value);
            }
          });
          console.log(zon);
          if (Array.isArray(zon)) {
            zon.forEach((v, i) => {
              client.updateSingleLed(sel, v, prevCols);
            });
          } else client.updateSingleLed(sel, zon, prevCols);
        }
      },
      {
        type: 'number',
        name: 'red',
        message: 'Red (0-255)',
        initial: 255,
        style: 'default',
        min: 1,
        max: 255,
        onState: async (state) => {
          prevCols.red = state.value;
          if (Array.isArray(zon)) {
            zon.forEach((v, i) => {
              client.updateSingleLed(sel, v, prevCols);
            });
          } else client.updateSingleLed(sel, zon, prevCols);
        }
      },
      {
        type: 'number',
        name: 'green',
        message: 'Green (0-255)',
        initial: 255,
        style: 'default',
        min: 1,
        max: 255,
        onState: async (state) => {
          prevCols.green = state.value;
          if (Array.isArray(zon)) {
            zon.forEach((v, i) => {
              client.updateSingleLed(sel, v, prevCols);
            });
          } else client.updateSingleLed(sel, zon, prevCols);
        }
      },
      {
        type: 'number',
        name: 'blue',
        message: 'Blue (0-255)',
        initial: 255,
        style: 'default',
        min: 1,
        max: 255,
        onState: async (state) => {
          prevCols.blue = state.value;
          if (Array.isArray(zon)) {
            zon.forEach((v, i) => {
              client.updateSingleLed(sel, v, prevCols);
            });
          } else client.updateSingleLed(sel, zon, prevCols);
        }
      },
      {
        type: 'select',
        name: 'function',
        message: 'Select animation',
        choices: [
          { title: 'Fade away', value: 'fade' },
          { title: 'Keep on', value: 'noop' }
        ],
      },
      {
        type: 'number',
        name: 'step',
        message: 'The animation has a granularity of',
        initial: 25,
        style: 'default',
        min: 10,
        max: 100
      },
      {
        type: 'number',
        name: 'interval',
        message: 'One animation grain takes this much time',
        initial: 10,
        style: 'default',
        min: 10,
        max: 1000
      },
    ]);
    fs.readFile("./settings.json", {encoding: "utf8"}, (err, data) => {
      var jsondata = JSON.parse(data);
      if (jsondata.devices == undefined) jsondata.devices = {};
      jsondata.devices[sel] = deviceIdentification;
      response.settings = {};
      response.settings.interval = response.interval;
      response.settings.step = response.step;
      response.interval = undefined;
      response.step = undefined;
      jsondata[keycodeJSWoo] = response;
      fs.writeFileSync("./settings.json", JSON.stringify(jsondata), {encoding: "utf8"});
      process.exit();
    })
    client.updateLeds(0, Array((await client.getControllerData(0)).colors.length).fill({red: 0, green: 0, blue: 0}));
  });
})();

function waitFor(conditionFunction) {

  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }

  return new Promise(poll);
}