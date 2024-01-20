import { useState, useEffect } from "react";

const useKeyPress = (targetKeys, keyMap, handleKeyPress = null, handleKeyRelease = null) => {
    const [keyStates, setKeyStates] = useState(
        Object.fromEntries(targetKeys.map(key => [key, false]))
    );

    const isTargetKey = (testKey, targetKey) => 
        Array.isArray(targetKey) ? targetKey.includes(testKey) : testKey === targetKey;

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Map the pressed key using keyMap, defaulting to the original key
            const mappedKey = keyMap[e.key] || e.key;
            console.log(mappedKey, e.key);

            for (const targetKey in keyStates) {
                if (isTargetKey(mappedKey, targetKey) && !keyStates[targetKey]) {
                    console.log(targetKey);
                    setKeyStates(prevState => ({ ...prevState, [targetKey]: true }));
                    if (handleKeyPress) handleKeyPress(mappedKey);
                }
            }
        };

        const handleKeyUp = (e) => {
            const mappedKey = keyMap[e.key] || e.key;

            for (const targetKey in keyStates) {
                if (isTargetKey(mappedKey, targetKey)) {
                    setKeyStates(prevState => ({ ...prevState, [targetKey]: false }));
                    if (handleKeyRelease) handleKeyRelease(mappedKey);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyPress, handleKeyRelease, keyMap, keyStates]);

    return keyStates;
};

export default useKeyPress;