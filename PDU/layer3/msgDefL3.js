// Message definition of layer 1, say, the interaction layer

const getMsgL3Template = () => {
    const msgL3 = {
        head: {
            type: null,     // can be: "draw", "addImg", "addStNt"
            option: null,
        },
        payload: {
            line: null,
            image: null,
            stickyNote: null,
        }
    };
    return msgL3;
};

export { getMsgL3Template };