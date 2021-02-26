// Message definition of layer 1, say, the session layer

const getMsgL1Template = () => {
    const msgL1 = {
        head: {
            type: null,     // can be: "connect", "disconnect", and "edit"
            option: null,   // pwd
        },
        payload: null
    };
    return msgL1;
};

export { getMsgL1Template };