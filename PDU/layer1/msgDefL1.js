// Message definition of layer 1, say, the session layer

// enumeration of 'type'
const TYPESL1 = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    EDIT: 'edit',
};

// Message template for type 'connect'
const getMsgL1TemplateConnect = () => {
    const msgL1 = {
        head: {
            type: 'connect',
            pwd: null,
            description: null,
            userid: null,
        },
        payload: null,
    };
    return msgL1;
};

// Message template for type 'disconnect'
const getMsgL1TemplateDisconnect = () => {
    const msgL1 = {
        head: {
            type: 'disconnect',
            description: null,
        },
        payload: null,
    };
    return msgL1;
};

// Message template for type 'edit'
const getMsgL1TemplateEdit = () => {
    const msgL1 = {
        head: {
            type: 'edit',
        },
        payload: null,
    };
    return msgL1;
};

const getMsgL1Template = (type=TYPESL1.CONNECT) => {
    if (type === TYPESL1.CONNECT) {
        return getMsgL1TemplateConnect();
    } else if (type === TYPESL1.DISCONNECT) {
        return getMsgL1TemplateDisconnect();
    } else if (type === TYPESL1.EDIT) {
        return getMsgL1TemplateEdit();
    }
};

module.exports = {
    TYPESL1,
    getMsgL1Template,
};