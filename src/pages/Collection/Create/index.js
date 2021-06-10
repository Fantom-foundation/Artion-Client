import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import cx from 'classnames';
import axios from 'axios';
import { Menu, MenuItem } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import CloseIcon from '@material-ui/icons/Close';
import { ClipLoader } from 'react-spinners';

import { Categories } from 'constants/filter.constants';
import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import toast from 'utils/toast';
import { API_URL } from 'api';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/svgs/discord.svg';
import telegramIcon from 'assets/svgs/telegram.svg';
import twitterIcon from 'assets/svgs/twitter.svg';
import instagramIcon from 'assets/svgs/instagram.svg';
import mediumIcon from 'assets/svgs/medium.svg';
import nftIcon from 'assets/svgs/nft_active.svg';

import styles from './styles.module.scss';

const CollectionCreate = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const inputRef = useRef(null);

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [creating, setCreating] = useState(false);
  const [logo, setLogo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(null);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteUrlError, setSiteUrlError] = useState('');
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

  const validateDescription = () => {
    if (description.length === 0) {
      setDescriptionError("This field can't be blank");
    } else {
      setDescriptionError(null);
    }
  };

  const validateAddress = () => {
    if (address.length === 0) {
      setAddressError("This field can't be blank");
    } else {
      setAddressError(null);
    }
  };

  const validateSiteUrl = () => {
    if (siteUrl.length === 0) {
      setSiteUrlError("This field can't be blank");
    } else {
      setSiteUrlError(null);
    }
  };

  const handleMenuOpen = e => {
    if (selected.length < 3) {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const selectCategory = catId => {
    setSelected([...selected, catId]);
    if (selected.length === 2) {
      setAnchorEl(null);
    }
  };

  const deselectCategory = catId => {
    setSelected(selected.filter(id => id !== catId));
  };

  const isValid = () => {
    if (!logo) return false;
    if (nameError) return false;
    if (descriptionError) return false;
    if (addressError) return false;
    if (siteUrl.length === 0) return false;
    return true;
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
    if (creating) return;

    setCreating(true);

    const img = new Image();
    img.onload = function() {
      const w = this.width;
      const h = this.height;
      const size = Math.min(w, h);
      const x = (w - size) / 2;
      const y = (h - size) / 2;
      clipImage(img, x, y, size, size, async logodata => {
        try {
          const formData = new FormData();
          formData.append('collectionName', name);
          formData.append('erc721Address', address);
          formData.append('imgData', logodata);
          const result = await axios({
            method: 'post',
            url: `${API_URL}/ipfs/uploadCollectionImage2Server`,
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
          console.log(data);

          await axios({
            method: 'post',
            url: `${API_URL}/collection/collectiondetails`,
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });

          toast('success', 'Collection created successfully!');

          history.push('/exploreall');
        } catch (e) {
          const { data } = e.response;
          toast('error', data.data);
          setCreating(false);
        }
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
          <div className={styles.inputTitle}>Logo image *</div>
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
          <div className={styles.inputTitle1}>Name *</div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, nameError && styles.hasError)}
              placeholder="Type your name here"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={validateName}
            />
            {nameError && <div className={styles.error}>{nameError}</div>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle1}>Description *</div>
          <div className={styles.inputWrapper}>
            <textarea
              className={cx(
                styles.input,
                styles.longInput,
                descriptionError && styles.hasError
              )}
              placeholder="Provide your description for your collection"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={validateDescription}
            />
            {descriptionError && (
              <div className={styles.error}>{descriptionError}</div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Category</div>
          <div className={styles.inputSubTitle}>
            Adding a category will help make your item discoverable on Fantom.
          </div>
          <div className={cx(styles.inputWrapper, styles.categoryList)}>
            <div
              className={cx(
                styles.categoryButton,
                selected.length === 3 && styles.disabled
              )}
              onClick={handleMenuOpen}
            >
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
              <div
                className={cx(styles.linkItem, addressError && styles.hasError)}
              >
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
                  onBlur={validateAddress}
                />
              </div>
              {addressError && (
                <div className={styles.error}>{addressError}</div>
              )}
              <div
                className={cx(styles.linkItem, siteUrlError && styles.hasError)}
              >
                <div className={styles.linkIconWrapper}>
                  <img src={webIcon} className={styles.linkIcon} />
                </div>
                <div className={styles.inputPrefix}>https://</div>
                <input
                  className={styles.linkInput}
                  placeholder="yoursite.io"
                  value={siteUrl}
                  onChange={e => setSiteUrl(e.target.value)}
                  onBlur={validateSiteUrl}
                />
              </div>
              {siteUrlError && (
                <div className={styles.error}>{siteUrlError}</div>
              )}
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
                  placeholder="yourTwitterHandle"
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
                  placeholder="yourInstagramHandle"
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
                  placeholder="yourMediumHandle"
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
          <div
            className={cx(
              styles.createButton,
              (creating || !isValid()) && styles.disabled
            )}
            onClick={isValid() ? handleSave : null}
          >
            {creating ? <ClipLoader color="#FFF" size={16} /> : 'Create'}
          </div>
        </div>
      </div>
      {renderMenu}
    </div>
  );
};

export default CollectionCreate;
