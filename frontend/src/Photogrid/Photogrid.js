import classes from './Photogrid.module.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
const Photogrid = (props) => {
  const [imagesCount, setImagesCount] = useState(10);
  const [images, setImages] = useState([]);
  const gridRef = useRef(null);
  const [isLoading, setLoadingStatus] = useState(false);
  const [show, setShow] = useState(false);
  const [isFetching, setFetching] = useState(false);

  const fetchImageUrls = useCallback(async (start = 0, end = 10) => {
    try {
      setLoadingStatus(true);
      setFetching(true);
      const width = (((window.screen.width) / 3) - 2 * 16);
      const height = 2 * 16 * 18;
      const url = `http://127.0.0.1:80/photos?width=${width}&height=${height}&start=${start}&end=${end}`;
      let response = await fetch(url);
      if (!response.ok) {
        setLoadingStatus(false);
        setFetching(false);
        return;
      }
      const imageurls = await response.json();
      setImages((currentImages) => currentImages.concat(imageurls.content));
      setLoadingStatus(false);
      setFetching(false);
    } catch (e) {
      setLoadingStatus(false);
      setFetching(false);
      console.error(e.message);
    }
  }, []);

  useEffect(() => {
    let start = imagesCount;
    const noOfImages = imagesCount + 10;
    let end = noOfImages;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!isFetching) {
          fetchImageUrls(start, end);
        }
      }
    }, { threshold: 1 });

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        // eslint-disable-next-line
        observer.unobserve(gridRef.current);
      }
    };
  }, [imagesCount, fetchImageUrls, isFetching])

  useEffect(() => {
    const numberOfImages = images.length;
    setImagesCount(numberOfImages);
  }, [images.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchImageUrls();
      setShow(true);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [fetchImageUrls]);

  return <>
    <div className={classes.gridlayout}>
      <div className={classes.gridlayoutInner}>
        {show && images.length > 0 && images.map((image, i) => React.cloneElement(props.children, { image: image, id: (image.id), key: (new Date().getTime + i) }))}
        {<div ref={gridRef} className={classes.lazyLoadingElement}> </div>}
      </div>
      {isLoading && <div className={classes.loading}> Loading... </div>}
    </div>
  </>
}

export { Photogrid };