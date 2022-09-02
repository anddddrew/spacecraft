const Icon = ({ src }: { src: string }) => (
    <picture className="flex">
        <img src={'/icons/' + src + '.svg'} alt="" className="aspect-square w-4 mr-2 my-auto" />
    </picture>
);

const fileIcons: Record<string, string> = {
    md: 'markdown',
    tsx: 'react_ts',
    jsx: 'react',
    scss: 'sass',
};
const folderIcons: Record<string, string> = {
    src: 'folder-src',
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
    const fileIcon = fileIcons[fileExt ?? ''] ?? 'file';

    return <Icon src={fileIcon} />;
};
