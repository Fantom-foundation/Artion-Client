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
        />
        <Button
          id="redo"
          icon={RedoIcon}
          onClick={paintStore.redo}
          keys="command+shift+z"
        />
        <Button
          id="reset"
          icon={TrashIcon}
          onClick={paintStore.reset}
          keys="command+shift+t"
        />
        <Button
          id="save"
          icon={SaveIcon}
          onClick={paintStore.save}
          keys="command+s"
        />
        <Button
          id="download"
          icon={DownloadIcon}
          onClick={paintStore.saveToFile}
          keys="command+d"
        />
        <Button
          id="load"
          icon={LoadIcon}
          onClick={paintStore.load}
          keys="command+l"
        />
        <Button
          id="fileupload"
          icon={fileUploadIcon}
          onClick={paintStore.setBackgroundImage}
          keys="command+o"
        />
        <Button
          id="eraser"
          icon={EraserIcon}
          onClick={paintStore.setEraseColor}
          keys="command+d"
        />
        <Button
          id="colors"
          icon={PaletteIcon}
          onClick={onPanelClick}
          isOpen={currentPanel === 'colors'}
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
        >
          <RangeSlider value={paintStore.size} setValue={paintStore.setSize} />
        </Button>
      </Container>
    </>
  );
};

export default inject('paintStore')(observer(Toolbar));
