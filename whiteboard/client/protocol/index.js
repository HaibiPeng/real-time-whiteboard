
const { drawLineDL2, undoDL2, connectDL2, disconnectDL2 } = require('./layer2/operationTransferLayerDownstream.js');
const { getUserid } = require('./layer2/stateManageLayer.js')
const { drawLineAction,getDrawLineHistory,getDrawLinePointer,unDoDrawLineToDecreasePointer, allDrawLines, getCurAction} = require('./layer2/stateManageLayer.js')

// var exports = module.exports={};
exports.drawLineDL2 = drawLineDL2;
exports.undoDL2 = undoDL2;
exports.connectDL2 = connectDL2;
exports.disconnectDL2 = disconnectDL2;
exports.getUserid = getUserid;
exports.drawLineAction = drawLineAction;
exports.getDrawLineHistory = getDrawLineHistory;
exports.getDrawLinePointer = getDrawLinePointer;
exports.unDoDrawLineToDecreasePointer = unDoDrawLineToDecreasePointer;
exports.allDrawLines = allDrawLines;
exports.getCurAction = getCurAction;
