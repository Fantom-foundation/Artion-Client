import React from 'react';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    margin: '10px 12px',
    flexGrow: 1,
    cursor: 'pointer',
    boxShadow: 'none',
    border: '1px solid #ddd',
    transition: 'transform ease 0.1s',
    display: 'flex',
    flexDirection: 'column',

    '&:hover': {
      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
  },
  label: {
    fontSize: 14,
    margin: 0,
    color: '#999',
  },
  name: {
    fontSize: 16,
    margin: 0,
    color: '#333',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    margin: 0,
    color: '#333',
  },
  media: {
    width: '100%',
    height: 200,
    backgroundSize: 'contain',
  },
  content: {
    borderTop: '1px solid #ddd',
    padding: '12px !important',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alignLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
});

const BaseCard = ({ style }) => {
  const classes = useStyles();
  const history = useHistory();

  const viewNFTDetails = () => {
    history.push('/explore/0x123/1');
  };

  return (
    <Box style={style} className={classes.root} onClick={viewNFTDetails}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="https://lh3.googleusercontent.com/c2Y0zp4LpzETIMO6FL4unRHXrGuxt9_ifWmqzbzQ_oqvh4LCZhMrswzWiBttEr3J-kQ5d9AVoq7VTfY2UxPhwynY=s992"
          title="Contemplative Reptile"
        />
        <CardContent className={classes.content}>
          <div className={classes.alignLeft}>
            <Typography component="h4" className={classes.label}>
              Category
            </Typography>
            <Typography component="h4" className={classes.name}>
              Sample
            </Typography>
          </div>
          <div className={classes.alignRight}>
            <Typography component="h4" className={classes.label}>
              Price
            </Typography>
            <Typography component="h4" className={classes.price}>
              Ξ 1.111
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(BaseCard);
