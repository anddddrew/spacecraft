import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Logo = forwardRef<HTMLImageElement, HTMLProps<HTMLImageElement>>((props, forwardedRef) => (
    <picture className={props.className}>
        <img className={props.className} src={`/icon.png`} alt="SpaceShip logo" ref={forwardedRef} />
    </picture>
));
