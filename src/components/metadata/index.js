import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { saveAs } from 'file-saver';

const useStyles = makeStyles(() => ({
  container: {
    width: '40%',
    height: '80%',
    background: 'white',
    position: 'fixed',
    right: '36px',
    top: '12%',
  },
  inkContainer: {
    borderBottom: '1px dotted blue',
  },
  inkMetadataInput: {
    margin: '24px',
    backgroundColor: '#ffffff !important',
    background: 'transparent !important',
  },
  inkButton: {
    width: '30%',
    letterSpacing: '11px',
    fontFamily: 'monospace',
    fontSize: 'x-large',
    backgroundColor: '#007bff !important',
    margin: '0 0 24px 0',
  },
  inkInputContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inkButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Metadata = () => {
  const classes = useStyles();

  const saveToFile = () => {
    let canvas = document.getElementById('drawingboard');
    canvas.toBlob(blob => {
      saveAs(blob, 'newArt.png');
    });
  };
  return (
    <div className={classes.container}>
      <div className={classes.inkContainer}>
        <div className={classes.inkInputContainer}>
          <TextField
            className={classes.inkMetadataInput}
            label="Name"
            variant="filled"
            id="inkmetadatanameinput"
          />
          <TextField
            className={classes.inkMetadataInput}
            label="Limit"
            variant="filled"
            type="number"
            id="inkmetadatalimitinput"
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
          />
        </div>
        <div className={classes.inkButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            className={classes.inkButton}
            onClick={saveToFile}
          >
            Ink
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Metadata;
