exports.handler = (event, context, callback) => {
  const request = event.Records[0].cf.request;
  callback(null, request);
};
