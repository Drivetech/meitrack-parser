const meitrack = require('meitrack-parser');

const raw = new Buffer('$$e155,867965021508656,AAA,35,-33.361133,-70.514245,160412155005,A,8,27,0,289,1.3,867,318379,2338885,730|1|32D3|A03F,0008,0000|0000|0000|02DA|0106,00000001,*3A\r\n');
const data = meitrack.parse(raw);
