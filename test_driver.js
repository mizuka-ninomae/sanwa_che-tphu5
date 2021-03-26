const Che_TPHU5     = require('sanwa_che-tphu5');
let  blu_mac        = "XX:XX:XX:XX:XX:XX";
let  noble_ctl_path = "/home/pi/sanwa_che-tphu5/";

let wosendor = new Che_TPHU5 (blu_mac, noble_ctl_path, function (error, value) {
    console.log (value);
    console.log (error);
});
