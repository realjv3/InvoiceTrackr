/**
 * Some helper functions
 */


export const showOverlay = () => {
    document.getElementById('loader').style.display = 'initial';
    document.getElementById('overlay').style.display = 'initial';
}

export const hideOverlay = () => {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
