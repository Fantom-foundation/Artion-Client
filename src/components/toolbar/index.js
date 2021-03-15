import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import { Container, Backdrop, BrushLine } from './style';
import {
  UndoIcon,
  RedoIcon,
  PaletteIcon,
  SaveIcon,
  LoadIcon,
  TrashIcon,
  BGIcon,
  EraserIcon,
  fileUploadIcon,
  DownloadIcon,
} from 'components/icons';
import { makeStyles } from '@material-ui/core/styles';
import Button from './button';
import RangeSlider from './rangeSlider';
import Colors from './colors';
import BackgroundColors from './backgroundcolors';

const useStyles = makeStyles(() => ({
  brush: {
    backgroundColor: '#007bff',
  },
}));

const Toolbar = ({ paintStore }) => {
  const classes = useStyles();
  const [currentPanel, setPanel] = useState(null);

  const onPanelClick = ({ currentTarget: { id } }) => {
    setPanel(currentPanel === id ? null : id);
  };

  return (
    <>
      {!!currentPanel && <Backdrop onClick={() => setPanel(null)} />}
      <Container>
        <Button
          id="undo"
          icon={UndoIcon}
          onClick={paintStore.undo}
          keys="command+z"
          tip="Undo"
        />

        <Button
          id="redo"
          icon={RedoIcon}
          onClick={paintStore.redo}
          keys="command+shift+z"
          tip="Redo"
        />
        <Button
          id="reset"
          icon={TrashIcon}
          onClick={paintStore.reset}
          keys="command+shift+t"
          tip="Reset"
        />
        <Button
          id="save"
          icon={SaveIcon}
          onClick={paintStore.save}
          keys="command+s"
          tip="Save"
        />
        <Button
          id="download"
          icon={DownloadIcon}
          onClick={paintStore.saveToFile}
          keys="command+d"
          tip="Download"
        />
        <Button
          id="load"
          icon={LoadIcon}
          onClick={paintStore.load}
          keys="command+l"
          tip="Load"
        />
        <Button
          id="fileupload"
          icon={fileUploadIcon}
          onClick={paintStore.setBackgroundImage}
          keys="command+o"
          tip="Upload File (preferably 500 by 500)"
        />
        <Button
          id="eraser"
          icon={EraserIcon}
          onClick={paintStore.setEraseColor}
          keys="command+d"
          tip="Eraser"
        />
        <Button
          id="colors"
          icon={PaletteIcon}
          onClick={onPanelClick}
          isOpen={currentPanel === 'colors'}
          tip="Color Picker"
        >
          <Colors
            currentColor={paintStore.color}
            setColor={paintStore.setColor}
          />
        </Button>

        <Button
          id="backgroundcolors"
          icon={BGIcon}
          onClick={onPanelClick}
          isOpen={currentPanel === 'backgroundcolors'}
          tip="Background Color Picker"
        >
          <BackgroundColors
            currentColor={paintStore.backgroundColor}
            setColor={paintStore.setBackgroundColor}
          />
        </Button>
        <Button
          id="brush"
          icon={<BrushLine size={paintStore.size} />}
          onClick={onPanelClick}
          isOpen={currentPanel === 'brush'}
          className={classes.brush}
          tip="Brush Size"
        >
          <RangeSlider value={paintStore.size} setValue={paintStore.setSize} />
        </Button>
      </Container>
    </>
  );
};

export default inject('paintStore')(observer(Toolbar));
