export const updateLines = (setLinePairs, draggingFixedPin, clientX, clientY) => {
    if (draggingFixedPin) {
        setLinePairs(prevLinePairs =>
            prevLinePairs.map(pair => {
                if (pair.fixedPin.id === draggingFixedPin.id) {
                    return {
                        ...pair,
                        fixedPin: {
                            ...pair.fixedPin,
                            latlng: {
                                lat: clientX,
                                lng: clientY,
                            },
                        },
                    };
                }
                return pair;
            })
        );
    }
};
