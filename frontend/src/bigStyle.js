
import canvasTexture from '../src/images/canvas.jpg'
import cityScape from '../src/images/cityScape.jpg';
import skyCastleImg from '../src/images/skyCastle.png';
import leaves from '../src/images/leaves.png';

export const blockAlignCenter = { display: 'block', textAlign: 'center'}

export  const maxWidthIs100 = { maxWidth: '100%' }

export  const widthIs100 = { width: '100%' }

export const flexJCenter = { display: 'flex', justifyContent: 'center' }

export const width40Blue = { width: '40%', color: 'blue' };

export const width20Red = { width: '20%', color: 'red' };

export const width75MarginAutoCenterText = { 
    width: '75%', 
    margin: 'auto', 
    textAlign: 'center', 
}
export const widthMaxMarginAutoCenterText = { 
    width: '100%', 
    margin: 'auto', 
    textAlign: 'center' 
}

export const width75MarginAuto = { width: '75%', margin: 'auto' };

export const textCenterMaxWidth = { 
    textAlign: 'center', 
    width: '100%'
};

export const width80 = { width: '80%'}

    
export const height25MaxWidth = {
    height: '25%', width: '100%' 
};

export const maxWidthMinHeight60 = { width: '100%', 'maxHeight': '60%' };

    // ------------------------------------------------
export const textAreaCreatePost = { 
    maxWidth: '100%', 
    width: '80%', 
    minHeight: '20vh'
};

export const chooseFile = {
    border: '1px solid #ccc',
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
};
    
export const submitButton = { 
    width: '290px', 
    maxWidth: '100%' 
};

export const followerCardImg = { 
    height: '20vh', 
    objectFit: 'scale-down' 
};

export const postPreviewCard = { 
    height: '300px', marginTop: 10 
};

export const postPreviewImage = { 
    height: '50%', 
    objectFit: 'scale-down', 
    backgroundImage: `url(${canvasTexture})`
};

export const secondaryNavSeg = { 
    width: '90%', 
    margin: 'auto', 
    textAlign: 'center' 
};

export const secondaryNavHeader = { fontFamily: 'funSized', fontSize: '45px' }

export const secondaryNavSmallHeader = { 
    bottom: '15%',
    position: 'relative',
    fontFamily: 'funSized',
    fontSize: '35px'
};

export const cityScapeBG = { backgroundImage: `url(${ cityScape })`, 
    backgroundRepeat: 'repeat', 
    minHeight: '100%', 
    height: 'fit', 
    width: '100%',
    textAlign: 'center'
}

export const feedImage = { 
    width: '100%', 
    height: '35vh', 
    objectFit: 'scale-down'
}

export const mainStrip = {
    display: 'block',
    width: '75%',
    margin: 'auto',
    minHeight: '100vh',
    height: 'fit',
    
}

export const loginWrapperStyle = { 
    height: '100%', 
    width: '100%', 
    backgroundImage: `url(${skyCastleImg})` 
}

export const formSegment = {
    width: '50%',
    margin: 'auto',
    top: '20vh',
    position: 'relative',
}

export const homeBG = {
    backgroundImage: `url(${ leaves })`,
    backgroundRepeat: 'repeat',
    height: 'fit%',
    minHeight: '100%',
}

export const followerButtons = { width: '37.5%', margin: 'auto' }

export const followerGrid = { 
    display: 'grid', gridTemplateColumns: '50% 50%'
}

export const postGrid = { display: 'grid', gridTemplateColumns: '25% 25% 25% 25%' }

export const commentBox = { maxHeight: '30vh', height: 'fit', overflow: 'scroll'}
    