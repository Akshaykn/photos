import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Photo.module.css';
import ExpandImage from './../expand.png';
import CloseImage from './../close.png';
import shareImage from './../share.png';
import likeImage from './../love.png';
import downloadImage from './../download.png';
import likedImage from './../like.png';
import editImage from './../edit.png';
import _ from 'lodash';

const Photo = (props) => {
    const ref = useRef(0)
    const imageRef = useRef(null);
    const [loadingScreen, setLoadingScreen] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageAsset, setImageAsset] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [showMenus, setShowMenus] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpandedMenus, setshowExpandedMenus] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilter, setFilter] = useState('none');
    const [selectedFilterName, setFilterName] = useState('default');
    const [photosFilters, setPhotosFilters] = useState([]);

    const generateImageUrl = useCallback((slide = 0) => {
        if (props.image.small_image_url) {
            setLoadingScreen(true);
            if (slide === 0) {
                slide = props.id;
            }
            const imageurl = "http://127.0.0.1:80" + props.image.small_image_url;
            setImageUrl(imageurl);
        }
    }, [props.image.small_image_url, props.id]);

    const fetchImage = useCallback(async () => {
        let refetch = false;
        if (imageUrl) {
            let image = await fetch(imageUrl);
            if (!image.ok) {
                refetch = true;
            } else {
                const res = await image.json();
                setImageAsset(res["content"]);
            }
        }
        while (refetch) {
            const responseImage = await fetch(imageUrl);
            if (responseImage.ok) {
                refetch = false;
                const response2 = await responseImage.json();
                setImageAsset(response2["content"]);
                break;
            }
        }
    }, [imageUrl]);

    useLayoutEffect(() => {
        generateImageUrl();
    }, [generateImageUrl]);

    useLayoutEffect(() => {
        fetchImage();
    }, [imageUrl, fetchImage]);

    const hideMenus = () => {
        setShowMenus(false);
    };

    const likephoto = async (id) => {
        try {
            const url = "http://127.0.0.1:80/likephoto"
            const result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    id: id
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            if (!result.ok) {
                throw new Error("Something went wrong.");
            }
            const response = await result.json();
            if (response.operationStatus === "OK") {
                setIsLiked(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const dislikephoto = async (id) => {
        try {
            const url = "http://127.0.0.1:80/dislikephoto"
            const result = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    id: id
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            if (!result.ok) {
                throw new Error("Something went wrong.");
            }
            const response = await result.json();
            if (response.operationStatus === "OK") {
                setIsLiked(false);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveFilterToBackend = async (id) => {
        try {
            const url = "http://127.0.0.1:80/save_filter_configurations"
            const result = await fetch(url, {
                method: 'PATCH',
                body: JSON.stringify({
                    id: id,
                    filterName: selectedFilterName,
                    filter: selectedFilter
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });
            if (!result.ok) {
                throw new Error("Something went wrong.");
            }
            const response = await result.json();
            if (response.operationStatus === "OK") { }
        } catch (e) {
            console.error(e);
        }
    };

    const onClickLike = (id) => {
        likephoto(id);
    }

    const onClickDisLike = (id) => {
        dislikephoto(id);
    }

    const onClickEdit = (id) => {
        if (showFilters) {
            saveFilterToBackend(id);
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }

    const photosFiltersTemp = useSelector((state) => state.filtersSlice.filters);

    const onClickExpand = () => {
        setIsExpanded(true);
        if (ref.current) {
            const scaledWidth = ref.current.offsetWidth * 2;
            const scaledHeight = ref.current.offsetHeight * 2;
            ref.current.style.width = `${scaledWidth}px`;
            ref.current.style.height = `${scaledHeight}px`;
            ref.current.style.position = 'fixed';
            ref.current.style.zIndex = 1006;
            const screenWidthMiddle = window.screen.availWidth / 2;
            const screenHeightMiddle = window.screen.availHeight / 2;
            ref.current.style.left = `${screenWidthMiddle - (scaledWidth / 2)}px`;
            ref.current.style.top = `${screenHeightMiddle - (scaledHeight / 2)}px`;
            ref.current.style.transition = '0.5s';
        }
    }

    const onClickClose = () => {
        setIsExpanded(false);
        setShowFilters(false);
        if (ref.current) {
            const scaledWidth = ref.current.offsetWidth / 2;
            ref.current.style.width = `${scaledWidth}px`;
            ref.current.style.height = `17.95rem`;
            ref.current.style.position = 'relative';
            ref.current.style.zIndex = 'unset';
            ref.current.style.left = `0px`;
            ref.current.style.top = `0px`;
            ref.current.style.transition = '0.5s';
            ref.current.style.display = 'flex';
            ref.current.style.flexDirection = 'row';
        }
    };

    const onClickFilter = (selectedFilter) => {
        let modifiedFilters = _.cloneDeep(photosFilters);
        modifiedFilters = modifiedFilters.map((filter) => {
            if (filter.filterid === selectedFilter.filterid) {
                filter.selected = true;
            } else {
                filter.selected = false;
            }
            return filter;
        });
        setPhotosFilters(modifiedFilters);
        setFilter(selectedFilter.filterStyle);
        setFilterName(selectedFilter.filterid);
    };

    useLayoutEffect(() => {
        let photo = React.createElement('img',
            {
                src: imageAsset,
                id: `${props.id}`,
                ref: imageRef,
                style: { filter: selectedFilter },
            });
        setPhoto(photo);
        if (imageRef.current) {
            imageRef.current.onload = function () {
                setLoadingScreen(false);
            }
            imageRef.current.onmouseover = function (event) {
                if (event?.relatedTarget?.className?.toLowerCase().includes("expand")) return;
                setshowExpandedMenus(true);
                setShowMenus(true);
            }
            imageRef.current.onmouseout = function (event) {
                if (event?.relatedTarget?.className?.toLowerCase().includes("expand")) return;
                if (isExpanded && showFilters) {
                    return;
                }
                setshowExpandedMenus(false);
                setShowMenus(false);
            }
        }
    }, [imageAsset, props.id, isExpanded, showFilters, selectedFilter])

    useLayoutEffect(() => {
        setIsLiked(props.image.liked);
    }, [props.image.liked]);

    useLayoutEffect(() => {
        const filtername = props?.image?.settings?.filterName || "default";
        const filter = props?.image?.settings?.filter || "none";
        let modifiedFilters = _.cloneDeep(photosFiltersTemp);
       
        if (modifiedFilters.length > 0 && filtername !== "default") {
            modifiedFilters = modifiedFilters.map((filter) => {
                if (filter.filterid === filtername) {
                    filter.selected = true;
                } else {
                    filter.selected = false;
                }
                return filter;
            });
        }
        modifiedFilters.length > 0 && setPhotosFilters(modifiedFilters);
        
        filtername !== "default" && setFilterName(filtername);
        filter !== "none" && setFilter(filter); 
    
    }, [props.image.settings.filterName, props.image.settings.filter, photosFiltersTemp]);

    useEffect(() => {
        if (isExpanded) {

            const largeImageUrl = "http://127.0.0.1:80" + props.image.large_image_url;

            async function fetchImage() {
                let image = await fetch(largeImageUrl);
                let refetch = false;
                if (!image.ok) {
                    refetch = true;
                } else {
                    const res = await image.json();
                    setImageAsset(res["content"]);
                }
                while (refetch) {
                    const responseImage = await fetch(largeImageUrl);
                    if (responseImage.ok) {
                        refetch = false;
                        const response2 = await image.json();
                        setImageAsset(response2["content"]);
                        break;
                    }
                }
            }

            fetchImage();
        }
    }, [isExpanded, props.image.large_image_url]);

    const imageClass = `expandImage-${props.id}`;

    const editClass = showFilters ? `${classes.imageCloseWrapper} ${classes.editSelected}` : `${classes.imageCloseWrapper} ${classes.editNotSelected}`

    return <div className={classes.photo} ref={ref}>
        {loadingScreen && <div className={classes.photoInner}>
            <div className={classes.loadingScreenInner}>
                <div style={{ "--barWidth": '80%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '20%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '40%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '60%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '90%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '10%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '100%', '--full': '0.5rem' }}> </div>
                <div style={{ "--barWidth": '20%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '80%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '50%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '50%', '--full': '0rem' }}> </div>
                <div style={{ "--barWidth": '100%', '--full': '0.5rem' }}> </div>
            </div>
        </div>}
        <div className={classes.imageInner}>
            {photo}
            {showMenus && !isExpanded && <div className={classes.menus}>
                <div className={classes.imageExpandWrapper} onMouseOut={hideMenus} onClick={onClickExpand}>
                    <img width="20px" height="20px" className={imageClass} src={ExpandImage} alt="expand" />
                </div>
            </div>}
            {isExpanded && <div className={classes.closeMenu}>
                <div className={classes.imageCloseWrapper}
                    onMouseOut={hideMenus}
                    onClick={onClickClose}
                    style={{ backgroundColor: '#333', borderRadius: "50%", padding: '0.3rem' }}>
                    <img width="18px" height="18px" className={classes.imageCloseClass} src={CloseImage} alt="expandclose" />
                </div>
            </div>}
            {isExpanded && showExpandedMenus && <div className={classes.expandedMenu}>
                <div className={classes.imageCloseWrapper}
                    onMouseOut={hideMenus}
                    onClick={onClickClose}
                >
                    <img width="20px" height="20px" className={classes.imageCloseClass} src={shareImage} alt="expandclose" />
                </div>
                {!isLiked &&
                    <div className={classes.imageCloseWrapper} onMouseOut={hideMenus} onClick={onClickLike.bind(this, props.id)}>
                        <img width="20px" height="20px" className={classes.imageCloseClass} src={likeImage} alt="expandclose" />
                    </div>}
                {isLiked && <div className={classes.imageCloseWrapper} onMouseOut={hideMenus} onClick={onClickDisLike.bind(this, props.id)}>
                    <img width="20px" height="20px" style={{ 'filter': 'none' }} className={classes.imageCloseClass} src={likedImage} alt="expandclose" />
                </div>}
                <div className={editClass} onMouseOut={hideMenus} onClick={onClickEdit.bind(this, props.id)}>
                    <img width="20px" height="20px" className={classes.imageCloseClass} src={editImage} alt="expandclose" />
                </div>
                <div className={classes.imageCloseWrapper} onMouseOut={hideMenus} onClick={onClickClose}>
                    <img width="20px" height="20px" className={classes.imageCloseClass} src={downloadImage} alt="expandclose" />
                </div>
            </div>}
            {isExpanded && showFilters &&
                <div className={classes.filters}>
                    {photosFilters.map((filter, index) => {
                        return <div className={classes.filter} key={index} onClick={onClickFilter.bind(this, filter)}>
                            <img src={imageAsset} alt="filter1" style={{ border: `${filter.selected ? '2px solid #fff' : 'none'}`, filter: filter.filterStyle }} />
                            <div><span style={{ color: '#fff', fontSize: '0.6rem' }}> {filter.filtername} </span></div>
                        </div>
                    })}
                </div>
            }
        </div>
    </div>
};

export { Photo };