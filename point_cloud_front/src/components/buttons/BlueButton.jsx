import React from 'react';

import classes from './BlueButton.module.css'

const BlueButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.blueBtn}>
            {children}
        </button>
    );
};

export default BlueButton;