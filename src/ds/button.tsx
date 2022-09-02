import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';

// eslint-disable-next-line react/display-name
export const Button = forwardRef<HTMLButtonElement, HTMLProps<HTMLButtonElement>>((props, forwardedRef) => (
    <button
        onClick={props.onClick}
        className={clsx('cursor-pointer select-none transition-colors hover:bg-black/[.05] dark:hover:bg-white/[.05]', props.className)}
        ref={forwardedRef}
    >
        {props.children}
    </button>
));
