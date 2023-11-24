/* eslint-disable no-undef */
import isFile from '../utils/isFile';
import isFolder from '../utils/isFolder';
import isImage from '../utils/isImage';
import Image from './Image';
import File from './File';
import Folder from './Folder';

export const itemRenderer = ({ key, style, item, variant, type }: any) => {
  let content: string | JSX.Element = 'unknown';

  if (isImage(item)) content = <Image {...(item as any)} variant={variant} />;
  else if (isFolder(item))
    content = <Folder {...(item as any)} variant={variant} />;
  else if (isFile(item))
    content = <File {...(item as any)} variant={variant} />;

  return (
    <div style={style} key={key} className={`item ${variant}`}>
      {content}
    </div>
  );
};
