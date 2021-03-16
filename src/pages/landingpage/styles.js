export const register = () => ({
  main: {
    width: '100vw',
    position: 'relative',
    bottom: '48px',
    top: '64px',
  },
  paper: {
    width: '100vw',
    position: 'relative',
    bottom: '48px',
    top: '0px',
    boxShadow: 'none !important',
    // '&:hover': {
    //   boxShadow: '0px 24px 36px rgba(131,153,167,0.99)',
    // },
  },
  image: {
    backgroundColor: 'rgb(255, 255, 255)',
    height: '12% !important',
    position: 'fixed',
    width: '-webkit-fill-available',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'none',
    zIndex: 100,
    left: '50%',
    transform: 'translateX(-50%)',
    top: '36px',
    position: 'relative',
  },
  largeFont: {
    fontFamily: 'cursive',
    fontSize: 'xxx-large',
    position: 'relative',
  },
  smallFont: {
    fontFamily: 'cursive',
    fontSize: 'unset',
  },
  carouselContainer: {
    marginTop: '120px',
    position: 'relative',
  },
  buttonsContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    marginTop: '90px',
  },
  landingPageButton: {
    width: '160px',
    height: '48px',
    marginLeft: '40px',
    marginRight: '40px',
    fontSize: 'x-large',
    backgroundColor: '#007bff',
  },
});
