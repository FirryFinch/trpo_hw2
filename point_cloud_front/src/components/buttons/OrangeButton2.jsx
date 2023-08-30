import React from 'react';

import classes from './OrangeButton2.module.css'

const OrangeButton2 = ({children, ...props}) => {
    return (
        <button {...props} className={classes.orangeBtn2}>
            {children}
        </button>
    );
};

export default OrangeButton2;