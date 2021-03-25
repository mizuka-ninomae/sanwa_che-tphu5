const child_process = require ('child_process');
const AsyncLock     = require ('async-lock');

let   te_val, hu_val, li_val, bt_val;

class CHE_TPHU5 {
  constructor (blu_mac, noble_ctl_path = '/usr/local/lib/node_modules/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('noble_key', function () {
      const noble_ctl = child_process.fork (path.join (noble_ctl_path, 'noble_ctl.js'));

      noble_ctl.send (blu_mac);

      noble_ctl.on ('message', function (json) {
        noble_ctl.kill ('SIGINT');
        let data = new Uint8Array (json.message.advertisement.manufacturerData.data);
        let temp = data[1] - 40;
        te_val   = temp < 0 ? temp + data[2] * -1 * 0.1 : temp + data[2] * 0.1;
        hu_val   = data[3];
        li_val   = data[4] * 256 + data[5];
        bt_val   = data[20];
        callback (null, {te: te_val, hu: hu_val, li: li_val, bt: bt_val});
        return;
      }.bind (this))

      noble_ctl.on ('error', function (error) {
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
