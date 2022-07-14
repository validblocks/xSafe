import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

interface TrimType {
  text: string;
  dataTestId?: string;
}

const Trim = ({ text, dataTestId = '' }: TrimType) => {
  const [overflow, setOverflow] = useState(false);
  const trimRef = useRef(document.createElement('span'));
  const hiddenTextRef = useRef(document.createElement('span'));

  const listener = useCallback(
    debounce(() => {
      if (trimRef.current && hiddenTextRef.current) {
        const diff = hiddenTextRef.current.offsetWidth - trimRef.current.offsetWidth;
        setOverflow(diff > 1);
      }
    }, 300),
    [],
  );

  const addWindowResizeListener = () => {
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(addWindowResizeListener);

  useEffect(() => {
    listener();
  }, []);

  return (
    <span
      ref={trimRef}
      className={`trim ${overflow ? 'overflow' : ''}`}
      data-testid={dataTestId}
    >
      <span ref={hiddenTextRef} className="hidden-text-ref">
        {text}
      </span>

      {overflow ? (
        <>
          <span className="left">
            <span>
              {String(text).substring(0, Math.floor(text.length / 2))}
            </span>
          </span>
          <span className="ellipsis">...</span>
          <span className="right">
            <span>{String(text).substring(Math.ceil(text.length / 2))}</span>
          </span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </span>
  );
}

export default Trim;
