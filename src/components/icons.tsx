const Icon = ({ src }: { src: string }) => (
    <picture className="flex">
        <img src={'/icons/' + src + '.svg'} alt="" className="aspect-square m-w-4 w-4 mr-2 my-auto" />
    </picture>
);

const fileIcons: Record<string, string> = {
    md: 'markdown',
    tsx: 'react_ts',
    jsx: 'react',
    scss: 'sass',
    ts: 'typescript',
    txt: 'document',
    mjs: 'javascript',
    css: 'css',
    json: 'json',
    png: 'image',
    ico: 'image',
};
const folderIcons: Record<string, string> = {
    src: 'folder-src',
    env: 'folder-environment',
    pages: 'folder-views',
    public: 'folder-public',
    styles: 'folder-css',
    '.vscode': 'folder-vscode',
};

const wholeFileIcons: Record<string, string> = {
    'package.json': 'nodejs',
    '.eslintrc.json': 'eslint',
    '.gitignore': 'git',
    'next.config.mjs': 'next',
    'postcss.config.cjs': 'postcss',
    'tailwind.config.cjs': 'tailwindcss',
    'tsconfig.json': 'tsconfig',
};

export const FolderLogo = ({ name, open }: { name: string; open?: boolean }) => {
    let iconName = folderIcons[name] ?? 'folder';

    if (open) {
        iconName = iconName + '-open';
    }

    return <Icon src={iconName} />;
};

export const FileIcon = ({ name }: { name: string }) => {
    const fileExt = name.split('.').pop();
    const fileIcon = wholeFileIcons[name] ?? fileIcons[fileExt ?? ''] ?? 'file';

    return <Icon src={fileIcon} />;
};
