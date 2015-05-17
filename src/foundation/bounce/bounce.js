xless.foundation({
    name : 'bounce',
    duration : 1000,
    support: [
        'transform',
        'transform-origin',
        'transition-timing-function',
        'animation-name',
        'animation-duration',
        'animation-fill-mode'
    ],
    use : function ( el ) {
        xless.classList.add( el, this.name );
    },
    fallback : function ( el ) {

    }
});