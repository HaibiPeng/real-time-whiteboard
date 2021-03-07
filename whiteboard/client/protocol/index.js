
const { drawLineDL2, undoDL2, connectDL2, disconnectDL2 } = require('./layer2/operationTransferLayerDownstream.js');
console.log(`drawLineDL2 is!: ${drawLineDL2}`);
console.log(`undoDL2 is!: ${undoDL2}`);

// var exports = module.exports={};
exports.drawLineDL2 = drawLineDL2;
exports.undoDL2 = undoDL2;
exports.connectDL2 = connectDL2;
exports.disconnectDL2 = disconnectDL2;