import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndoAlt,
  faRedoAlt,
  faPalette,
  faSave,
  faUpload,
  faTrash,
  faFillDrip,
  faEraser,
  faFileUpload,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

export const UndoIcon = <FontAwesomeIcon icon={faUndoAlt} color="#007bff" />;
export const RedoIcon = <FontAwesomeIcon icon={faRedoAlt} color="#007bff" />;
export const PaletteIcon = <FontAwesomeIcon icon={faPalette} color="#007bff" />;
export const SaveIcon = <FontAwesomeIcon icon={faSave} color="#007bff" />;
export const LoadIcon = <FontAwesomeIcon icon={faUpload} color="#007bff" />;
export const TrashIcon = <FontAwesomeIcon icon={faTrash} color="#007bff" />;
export const BGIcon = <FontAwesomeIcon icon={faFillDrip} color="#007bff" />;
export const EraserIcon = <FontAwesomeIcon icon={faEraser} color="#007bff" />;
export const DownloadIcon = (
  <FontAwesomeIcon icon={faDownload} color="#007bff" />
);
export const fileUploadIcon = (
  <FontAwesomeIcon icon={faFileUpload} color="#007bff" />
);
