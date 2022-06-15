# OpenRGB_LEDKeys

A Node.JS executable for running LED events on keypresses.

## Quick Start 
Open or install OpenRGB, start a server (on default port), and then run
```
npm install
node config.js
```
Repeat running `node config.js` for all of the keys you need to bind. 

After you are done, run `node corsair.js` (regardless of actual keyboard model) and enjoy!

## Reset Settings

First, open `settings.json` in a text editor and auto-format it:

```
{
  "2": {
    "device": 0,
    "zone": [
      0,
      1,
      2
    ],
    "red": 255,
    "green": 255,
    "blue": 255,
    "function": "noop",
    "settings": {
      "interval": 10,
      "step": 25
    }
  },
  ...
  
  ...
  "devices": {
    "0": "Corsair K55 RGB"
  }
}
```

Now empty the main Object:
```
{}
```
And then save. You can now re-run `node config.js` for as many keys as you need to bind.

## Troubleshooting

### Program stops at `The device X (device x) is either not connected or misplaced`

Check all of your connections, and make sure that OpenRGB is listing all of the same Device IDs as seen at the end of `settings.json`.

![image](https://user-images.githubusercontent.com/58280776/173926561-3754475e-1e97-42ce-a562-fa1b57df3a9a.png)
```
{
  ...
  "devices": {
    "0": "Corsair K55 RGB"
  }
}
```
If this list is not the same, or `settings.json` is listing an extra device...

![image](https://user-images.githubusercontent.com/58280776/173928554-6cb3a222-576f-45ed-b165-7fe77cc01a3a.png)
```
{
  ...
  "devices": {
    "0": "Corsair K55 RGB",
    "1": "Generic device (/dev/usb1)"
  }
}
```
...follow these instructions:

#### If you use the device / If the device name is recognizable

Check your connections to the device and rescan in OpenRGB.

### If you don't use the listed device / If the device name is a placeholder

Remove the device name from the list and save `settings.json`.
