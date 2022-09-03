const a = {
    name: 'root',
    path: '/',
    open: true,
    children: [
        {
            name: 'README.md',
            path: '/readme.md',
        },
        {
            name: 'cover.png',
            path: '/cover.png',
        },
        {
            name: 'LICENSE.txt',
            path: '/LICENSE.txt',
        },
        {
            name: 'src',
            open: true,
            path: '/src',
            children: [
                {
                    name: 'index.tsx',
                    path: '/src/index.tsx',
                },
                {
                    name: 'button.tsx',
                    path: '/src/button.tsx',
                },
                {
                    name: 'cool-things',
                    open: true,
                    path: '/src/cool-things',
                    children: [
                        {
                            name: 'very-cool.scss',
                            path: '/src/cool-things/very-cool.scss',
                        },
                        {
                            name: 'also-cool.tsx',
                            path: '/src/cool-things/button.tsx',
                        },
                    ],
                },
            ],
        },
    ],
};
export {};
