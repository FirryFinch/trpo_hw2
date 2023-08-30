import React from 'react';

import classes from './OrangeButton.module.css'

const OrangeButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.orangeBtn}>
            {children}
        </button>
    );
};

export default OrangeButton;