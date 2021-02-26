// Message definition of layer 2, say, the operation management layer

const getMsgL2Template = () => {
    const msgL2 = {
        head: {
            type: null,
            option: {
                userid: null,
            },
        },
        payload: null
    };
    return msgL2;
};

export { getMsgL2Template };