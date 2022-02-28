const whitelist = [
  '5.2.213.244', // office RDS
  '35.158.37.8', // vpn elrond ?
  '83.103.170.152', // vpn elrond upc
  '104.248.25.147', // vpn elrond do
  '82.76.245.236', // stan
  '188.25.132.177', // virgil serbanuta
  '73.168.39.137', // yi zhang
  '79.115.61.254', // calin nicolau
  '178.138.192.133' // stan
];

exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;

  if (whitelist.includes(request.clientIp)) {
    callback(null, request);
  } else {
    callback(true);
  }
};
