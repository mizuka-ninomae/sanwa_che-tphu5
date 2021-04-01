const child_process = require ('child_process');
const path          = require ('path');
const AsyncLock     = require ('async-lock');

const s_uuid = [];

class CHE_TPHU5 {
  constructor (ble_mac, ble_ctl_path = '/usr/local/lib/node_modules/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('ble_key', function () {
      const ble_ctl = child_process.fork (path.join (ble_ctl_path, 'noble_ctl.js'));

      ble_ctl.send (ble_mac);

      ble_ctl.on ('message', function (json) {
        ble_ctl.kill ('SIGINT');
        let temp = json.message.manufacturerData.data[1] - 40;
        callback (null, {
          te: temp < 0 ? temp + (json.message.manufacturerData.data[2] * 0.1) * -1 : temp + (json.message.manufacturerData.data[2] * 0.1),
          hu: json.message.manufacturerData.data[3],
          li: json.message.manufacturerData.data[4] * 256 + json.message.manufacturerData.data[5],
          bt: json.message.manufacturerData.data[20]
        });
        return;
      }.bind (this))

      ble_ctl.on ('error', function (error) {
        callback (error, null);
        return;
      }.bind(this));
    });
  }
}

if (require.main === module) {
  new CHE_TPHU5 (process.argv[2], process.argv[3], function (error, value) {
    console.log (value);
    console.log (error);
  });
}
else {
  module.exports = CHE_TPHU5;
}
