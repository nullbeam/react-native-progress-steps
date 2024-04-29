import { createContext } from 'react';

export default ProgressContext = createContext({
    setActiveStep: () => {},
    activeStep: 0,
    stepCount: 0,
});