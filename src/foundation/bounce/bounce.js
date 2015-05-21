xless.extend({
    name : 'bounce',
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
    fallback : function ( el, evt ) {
        evt.start(el)
            .to(200,200);
    }
});