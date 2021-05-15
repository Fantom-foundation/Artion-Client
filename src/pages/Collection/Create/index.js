import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import cx from 'classnames';
import axios from 'axios';
import { Menu, MenuItem } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import CloseIcon from '@material-ui/icons/Close';

import { Categories } from 'constants/filter.constants';
import HeaderActions from 'actions/header.actions';
import Header from 'components/header';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/imgs/discord.png';
import telegramIcon from 'assets/imgs/telegram.png';
import twitterIcon from 'assets/imgs/twitter.png';
import instagramIcon from 'assets/imgs/instagram.png';
import mediumIcon from 'assets/svgs/medium.svg';
import nftIcon from 'assets/svgs/nft_active.svg';

import styles from './styles.module.scss';

const CollectionCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const inputRef = useRef(null);

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [logo, setLogo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [mediumHandle, setMediumHandle] = useState('');
  const [telegram, setTelegram] = useState('');

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  const options = Categories.filter(cat => selected.indexOf(cat.id) === -1);
  const selectedCategories = Categories.filter(
    cat => selected.indexOf(cat.id) > -1
  );

  const handleFileSelect = e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      const reader = new FileReader();

      reader.onload = function(e) {
        setLogo(e.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const validateName = () => {
    if (name.length === 0) {
      setNameError("This field can't be blank");
    } else {
      setNameError(null);
    }
  };

  const handleMenuOpen = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const selectCategory = catId => {
    setSelected([...selected, catId]);
  };

  const deselectCategory = catId => {
    setSelected(selected.filter(id => id !== catId));
  };

  const clipImage = (image, clipX, clipY, clipWidth, clipHeight, cb) => {
    const CANVAS_SIZE = Math.max(Math.min(512, clipWidth), 128);
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      clipX,
      clipY,
      clipWidth,
      clipHeight,
      0,
      0,
      CANVAS_SIZE,
      CANVAS_SIZE
    );
    cb(canvas.toDataURL());
  };

  const handleSave = async () => {
    const img = new Image();
    img.onload = function() {
      const w = this.width;
      const h = this.height;
      const size = Math.min(w, h);
      const x = (w - size) / 2;
      const y = (h - size) / 2;
      clipImage(img, x, y, size, size, async logodata => {
        const formData = new FormData();
        formData.append('collectionName', name);
        formData.append('erc721Address', address);
        formData.append('imgData', logodata);
        const result = await axios({
          method: 'post',
          url:
            'https://fmarket.fantom.network/ipfs/uploadCollectionImage2Server',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        });

        const logoImageHash = result.data.data;
        const data = {
          erc721Address: address,
          collectionName: name,
          description,
          categories: selected.join(','),
          logoImageHash,
          siteUrl,
          discord,
          twitterHandle,
          instagramHandle,
          mediumHandle,
          telegram,
        };

        await axios({
          method: 'post',
          url: 'https://fmarket.fantom.network/collection/collectiondetails',
          data: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });

        // TODO: show success notification
        history.push('/exploreall');
      });
    };
    img.src = logo;
  };

  const menuId = 'select-category-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      classes={{
        paper: styles.menu,
      }}
    >
      {options.map((cat, idx) => (
        <MenuItem
          key={idx}
          className={styles.category}
          onClick={() => selectCategory(cat.id)}
        >
          <img src={cat.icon} />
          <span className={styles.categoryLabel}>{cat.label}</span>
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <div className={styles.container}>
      <Header light />
      <div className={styles.inner}>
        <div className={styles.title}>Create Collection</div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Logo image</div>
          <div className={styles.inputSubTitle}>
            This image will also be used for navigation. 300x300 recommended.
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.logoUploadBox}>
              {logo && <img src={logo} />}
              <div className={styles.uploadOverlay}>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileSelect}
                />
                <PublishIcon
                  onClick={() => inputRef.current?.click()}
                  className={styles.uploadIcon}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Name</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, nameError && styles.hasError)}
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={validateName}
            />
            {nameError && <div className={styles.error}>{nameError}</div>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Description</div>
          <div className={styles.inputSubTitle}>
            {description.length} of 1000 characters used.
          </div>
          <div className={styles.inputWrapper}>
            <textarea
              className={cx(styles.input, styles.longInput)}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Category</div>
          <div className={styles.inputSubTitle}>
            Adding a category will help make your item discoverable on Fantom.
          </div>
          <div className={cx(styles.inputWrapper, styles.categoryList)}>
            <div className={styles.categoryButton} onClick={handleMenuOpen}>
              Add Category
            </div>
            {selectedCategories.map((cat, idx) => (
              <div
                className={styles.selectedCategory}
                key={idx}
                onClick={() => deselectCategory(cat.id)}
              >
                <img src={cat.icon} className={styles.categoryIcon} />
                <span className={styles.categoryLabel}>{cat.label}</span>
                <CloseIcon className={styles.closeIcon} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Links</div>
          <div className={styles.inputWrapper}>
            <div className={styles.linksWrapper}>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={nftIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>
                  https://ftmscan.com/address/
                </div>
                <input
                  className={styles.linkInput}
                  placeholder="0x..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={webIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix} />
                <input
                  className={styles.linkInput}
                  placeholder="yoursite.io"
                  value={siteUrl}
                  onChange={e => setSiteUrl(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={discordIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>https://discord.gg/</div>
                <input
                  className={styles.linkInput}
                  placeholder="abcdef"
                  value={discord}
                  onChange={e => setDiscord(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={twitterIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>@</div>
                <input
                  className={styles.linkInput}
                  placeholder="YourTwitterHandle"
                  value={twitterHandle}
                  onChange={e => setTwitterHandle(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={instagramIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>@</div>
                <input
                  className={styles.linkInput}
                  placeholder="YourInstagramHandle"
                  value={instagramHandle}
                  onChange={e => setInstagramHandle(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={mediumIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>@</div>
                <input
                  className={styles.linkInput}
                  placeholder="YourMediumHandle"
                  value={mediumHandle}
                  onChange={e => setMediumHandle(e.target.value)}
                />
              </div>
              <div className={styles.linkItem}>
                <div className={styles.linkIconWrapper}>
                  <img src={telegramIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>https://t.me/</div>
                <input
                  className={styles.linkInput}
                  placeholder="abcdef"
                  value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <div className={styles.createButton} onClick={handleSave}>
            Create
          </div>
        </div>
      </div>
      {renderMenu}
    </div>
  );
};

export default CollectionCreate;
