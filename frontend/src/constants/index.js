const selectedHandler = {
    selected: false,
    select: function () {
        this.selected = true;
    },
    deselect: function () {
        this.selected = false;
    }
};

export const photosFilters = [{
    filtername: 'default',
    filterid: 'default',
    filterStyle: "none",
    ...selectedHandler,
    selected: true
}, {
    filtername: 'vintage',
    filterid: 'vintage',
    filterStyle: "grayscale(5)",
    ...selectedHandler,
}, {
    filtername: 'martian',
    filterid: 'martian',
    filterStyle: "contrast(1.5)",
    ...selectedHandler,
}, {
    filtername: 'boom',
    filterid: 'boom',
    filterStyle: "hue-rotate(20deg) contrast(1.6)",
    ...selectedHandler,
}, {
    filtername: 'springs',
    filterid: 'springs',
    filterStyle: "saturate(100%) hue-rotate(25deg)",
    ...selectedHandler,
}, {
    filtername: 'oldschool',
    filterid: 'oldschool',
    filterStyle: "sepia(100%)",
    ...selectedHandler,
}, {
    filtername: 'negetive',
    filterid: 'negetive',
    filterStyle: "invert(100%)",
    ...selectedHandler,
}, {
    filtername: 'custom',
    filterid: 'custom',
    filterStyle: "none",
    ...selectedHandler,
}];