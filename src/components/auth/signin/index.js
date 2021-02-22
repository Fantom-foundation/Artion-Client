import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { register } from './styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { FormControl, Input, InputLabel, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/Error';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@material-ui/icons/VisibilityOffTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import FantomLogo from '../../../assets/svgs/fantom_logo_white_new.svg';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import EmailValidator from 'email-deep-validator';
import AuthManager from '../authmanager';
import AuthActions from '../../../actions/auth.actions';

const SignIn = ({ classes }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState(null);
  const [errorOpen, setErrorOpen] = useState(false);

  const errorClose = () => {
    setErrorOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'hidePassword':
        setHidePassword(value);
        break;
      case 'error':
        setError(value);
        break;
      case 'errorOpen':
        setErrorOpen(value);
        break;
      default:
        break;
    }
  };

  const showPassword = () => {
    setHidePassword(!hidePassword);
  };

  const isValidPassword = () => {
    if (password === '') {
      return false;
    }
    return true;
  };

  const isValidEmail = async () => {
    let emailValidator = new EmailValidator();
    let {
      wellFormed /*, validDomain, validMailbox*/,
    } = await emailValidator.verify(email);
    // return wellFormed && validDomain && validMailbox;
    return wellFormed;
  };

  const isFullyValid = async () => {
    let _isValidEmail = await isValidEmail();
    return isValidPassword() && _isValidEmail;
  };

  const isValid = () => {
    return password != '' && email != '';
  };

  const submitSignIn = async e => {
    e.preventDefault();
    let _isFullyValid = await isFullyValid();
    if (!_isFullyValid) {
      console.log('not fully valid');
      return;
    }

    let _ifSignedIn = await AuthManager.signIn(email, password);
    if (_ifSignedIn) {
      history.push('/create');
      dispatch(AuthActions.signinSuccess());
    } else {
      dispatch(AuthActions.signinFailed());
    }
  };

  return (
    <div className={classes.main}>
      <CssBaseline />

      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src={FantomLogo} className={classes.icon} />
        </Avatar>
        <form className={classes.form} onSubmit={() => submitSignIn}>
          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="email" className={classes.labels}>
              e-mail
            </InputLabel>
            <Input
              name="email"
              type="email"
              autoComplete="email"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl required fullWidth margin="normal">
            <InputLabel htmlFor="password" className={classes.labels}>
              password
            </InputLabel>
            <Input
              name="password"
              autoComplete="password"
              className={classes.inputs}
              disableUnderline={true}
              onChange={handleChange}
              type={hidePassword ? 'password' : 'input'}
              endAdornment={
                hidePassword ? (
                  <InputAdornment position="end">
                    <VisibilityOffTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={showPassword}
                    />
                  </InputAdornment>
                ) : (
                  <InputAdornment position="end">
                    <VisibilityTwoToneIcon
                      fontSize="default"
                      className={classes.passwordEye}
                      onClick={showPassword}
                    />
                  </InputAdornment>
                )
              }
            />
          </FormControl>

          <Button
            disabled={!isValid()}
            disableRipple
            variant="outlined"
            className={classes.button}
            type="submit"
            onClick={submitSignIn}
          >
            Sign In
          </Button>
        </form>

        {error ? (
          <Snackbar
            variant="error"
            key={error}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={errorOpen}
            onClose={errorClose}
            autoHideDuration={3000}
          >
            <SnackbarContent
              className={classes.error}
              message={
                <div>
                  <span style={{ marginRight: '8px' }}>
                    <ErrorIcon fontSize="large" color="error" />
                  </span>
                  <span> {error} </span>
                </div>
              }
              action={[
                <IconButton key="close" aria-label="close" onClick={errorClose}>
                  <CloseIcon color="error" />
                </IconButton>,
              ]}
            />
          </Snackbar>
        ) : null}
      </Paper>
    </div>
  );
};

export default withStyles(register)(SignIn);
