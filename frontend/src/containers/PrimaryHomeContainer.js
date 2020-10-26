// imports:
import React from 'react';

import PrimaryNav from '../components/PrimaryNav';

import leaves from '../images/leaves.png';
// end of imports -----------------------------------------

const PrimaryHomeContainer = () => {


    return(
        <div
            style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${leaves})`
            }}
        >
            <PrimaryNav />
        </div>
    );
};
export default PrimaryHomeContainer;