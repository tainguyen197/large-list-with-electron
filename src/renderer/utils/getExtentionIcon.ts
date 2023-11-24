import pdfIcon from '../../../assets/icons/icons8-pdf-60.png';
import pptIcon from '../../../assets/icons/icons8-ppt-48.png';
import txtIcon from '../../../assets/icons/icons8-txt-60.png';
import mp4Icon from '../../../assets/icons/icons8-mp4-48.png';
import wordIcon from '../../../assets/icons/icons8-word.svg';
import excelIcon from '../../../assets/icons/icons8-excel.svg';
import unknownIcon from '../../../assets/icons/icons8-unknown-60.png';

const mappingIcon = {
  '.doc': wordIcon,
  '.docx': wordIcon,
  '.xlsx': excelIcon,
  '.pdf': pdfIcon,
  '.ppt': pptIcon,
  '.txt': txtIcon,
  '.mp4': mp4Icon,
};

const getExtensionIcon = (extension: keyof typeof mappingIcon) => {
  return mappingIcon[extension] || unknownIcon;
};

export default getExtensionIcon;
