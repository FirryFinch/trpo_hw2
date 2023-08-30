import React from 'react';

import classes from './BlueButton2.module.css'

const BlueButton2 = ({children, ...props}) => {
    return (
        <button {...props} className={classes.blueBtn2}>
            {children}
        </button>
    );
};

export default BlueButton2;