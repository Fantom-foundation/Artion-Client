import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import cx from 'classnames';
import axios from 'axios';
import { Menu, MenuItem } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PublishIcon from '@material-ui/icons/Publish';
import CloseIcon from '@material-ui/icons/Close';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { ClipLoader } from 'react-spinners';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { Categories } from 'constants/filter.constants';
import HeaderActions from 'actions/header.actions';
import Header from 'components/header';
import BootstrapTooltip from 'components/BootstrapTooltip';
import toast from 'utils/toast';
import { useApi } from 'api';
import { useFactoryContract } from 'contracts';

import webIcon from 'assets/svgs/web.svg';
import discordIcon from 'assets/svgs/discord.svg';
import telegramIcon from 'assets/svgs/telegram.svg';
import twitterIcon from 'assets/svgs/twitter.svg';
import instagramIcon from 'assets/svgs/instagram.svg';
import mediumIcon from 'assets/svgs/medium.svg';
import nftIcon from 'assets/svgs/nft_active.svg';

import styles from './styles.module.scss';

const CollectionCreate = ({ isRegister }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { account } = useWeb3React();
  const { explorerUrl, apiUrl } = useApi();
  const { createNFTContract, createPrivateNFTContract } = useFactoryContract();

  const inputRef = useRef(null);

  const { authToken } = useSelector(state => state.ConnectWallet);

  const [deploying, setDeploying] = useState(false);
  const [creating, setCreating] = useState(false);
  const [logo, setLogo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [symbolError, setSymbolError] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteUrlError, setSiteUrlError] = useState('');
  const [discord, setDiscord] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [mediumHandle, setMediumHandle] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    dispatch(HeaderActions.toggleSearchbar(false));
  }, []);

  useEffect(() => {
    setLogo(null);
    setAnchorEl(null);
    setSelected([]);
    setName('');
    setNameError(null);
    setSymbol('');
    setSymbolError(null);
    setDescription('');
    setDescriptionError(null);
    setEmail('');
    setEmailError(null);
    setAddress('');
    setAddressError(null);
    setSiteUrl('');
    setSiteUrlError(null);
    setDiscord('');
    setTwitterHandle('');
    setInstagramHandle('');
    setMediumHandle('');
    setTelegram('');
  }, [isRegister]);

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

  const validateSymbol = () => {
    if (symbol.length === 0) {
      setSymbolError("This field can't be blank");
    } else if (symbol.includes(' ')) {
      setSymbolError("Symbol can't include spaces");
    } else {
      setSymbolError(null);
    }
  };

  const validateDescription = () => {
    if (description.length === 0) {
      setDescriptionError("This field can't be blank");
    } else {
      setDescriptionError(null);
    }
  };

  const validEmail = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);

  const validateEmail = () => {
    if (email.length === 0) {
      setEmailError("This field can't be blank");
    } else if (validEmail(email)) {
      setEmailError(null);
    } else {
      setEmailError('Invalid email address.');
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

  const isValid = (() => {
    if (!logo) return false;
    if (nameError) return false;
    if (descriptionError) return false;
    if (addressError) return false;
    if (siteUrl.length === 0) return false;
    if (email.length === 0) return false;
    return true;
  })();

  const clipImage = (image, clipX, clipY, clipWidth, clipHeight, cb) => {
    const CANVAS_SIZE = 128;
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

  const handleRegister = async () => {
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
            url: `${apiUrl()}/ipfs/uploadCollectionImage2Server`,
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${authToken}`,
            },
          });

          const logoImageHash = result.data.data;
          const data = {
            email,
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
            url: `${apiUrl()}/collection/collectiondetails`,
            data: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          });

          toast(
            'success',
            'Application submitted!',
            'Your collection registration application is successfully submitted for review.\nOnce approved, you will get an email notification.'
          );

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

  const handleCreate = async () => {
    setDeploying(true);
    try {
      const tx = await (isPrivate
        ? createPrivateNFTContract
        : createNFTContract)(
        name,
        symbol,
        ethers.utils.parseEther('50'),
        account
      );
      const res = await tx.wait();
      res.events.map(evt => {
        if (
          evt.topics[0] ===
          '0x2d49c67975aadd2d389580b368cfff5b49965b0bd5da33c144922ce01e7a4d7b'
        ) {
          setDeploying(false);
          setCreating(true);

          const address = ethers.utils.hexStripZeros(
            ethers.utils.hexDataSlice(evt.data, 32)
          );

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
                  url: `${apiUrl()}/ipfs/uploadCollectionImage2Server`,
                  data: formData,
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${authToken}`,
                  },
                });
                const logoImageHash = result.data.data;
                const data = {
                  email,
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
                  url: `${apiUrl()}/collection/collectiondetails`,
                  data: JSON.stringify(data),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                  },
                });

                toast('success', 'Collection created successfully!');

                setCreating(false);

                history.push('/exploreall');
              } catch (e) {
                setCreating(false);
              }
            });
          };
          img.src = logo;
        }
      });
    } catch (err) {
      console.log(err);
      setDeploying(false);
    }
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
        <div className={styles.title}>
          {isRegister ? 'Register' : 'Create New'} Collection
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>Your Own Collection *</div>
          <RadioGroup
            className={styles.inputWrapper}
            value={JSON.stringify(isPrivate)}
            onChange={e => setIsPrivate(e.currentTarget.value === 'true')}
          >
            <FormControlLabel
              value="false"
              control={<Radio color="primary" />}
              label="Allow others mint NFTs under my collection"
            />
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Only I can mint NFTs under my collection"
            />
          </RadioGroup>
        </div>

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
              maxLength={20}
              placeholder="Collection Name"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={validateName}
            />
            <div className={styles.lengthIndicator}>{name.length}/20</div>
            {nameError && <div className={styles.error}>{nameError}</div>}
          </div>
        </div>

        {!isRegister && (
          <div className={styles.inputGroup}>
            <div className={styles.inputTitle1}>Symbol *</div>
            <div className={styles.inputWrapper}>
              <input
                className={cx(styles.input, symbolError && styles.hasError)}
                maxLength={20}
                placeholder="Collection Symbol"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                onBlur={validateSymbol}
              />
              <div className={styles.lengthIndicator}>{symbol.length}/20</div>
              {symbolError && <div className={styles.error}>{symbolError}</div>}
            </div>
          </div>
        )}

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle1}>Description *</div>
          <div className={styles.inputWrapper}>
            <textarea
              className={cx(
                styles.input,
                styles.longInput,
                descriptionError && styles.hasError
              )}
              maxLength={200}
              placeholder="Provide your description for your collection"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={validateDescription}
            />
            <div className={styles.lengthIndicator}>
              {description.length}/200
            </div>
            {descriptionError && (
              <div className={styles.error}>{descriptionError}</div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle}>
            Category&nbsp;
            <BootstrapTooltip
              title="Adding a category will help make your item discoverable on Fantom."
              placement="top"
            >
              <HelpOutlineIcon />
            </BootstrapTooltip>
          </div>
          <div className={styles.inputSubTitle}>
            Adding a category will help make your item discoverable on Fantom.
          </div>
          <div className={styles.inputSubTitle}>
            For more information, read{' '}
            <a
              href="https://docs.fantom.foundation/"
              target="_blank"
              rel="noopener noreferrer"
            >
              this
            </a>
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
              {isRegister && (
                <>
                  <div
                    className={cx(
                      styles.linkItem,
                      addressError && styles.hasError
                    )}
                  >
                    <div className={styles.linkIconWrapper}>
                      <img src={nftIcon} className={styles.linkIcon} />
                    </div>
                    <div className={styles.inputPrefix}>
                      {explorerUrl()}/address/
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
                </>
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

        <div className={styles.inputGroup}>
          <div className={styles.inputTitle1}>
            Contact Email&nbsp;
            <BootstrapTooltip
              title="We will use this email to notify you about your collection application. This will not be shared with others."
              placement="top"
            >
              <HelpOutlineIcon />
            </BootstrapTooltip>
          </div>
          <div className={styles.inputWrapper}>
            <input
              className={cx(styles.input, emailError && styles.hasError)}
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          {isRegister ? (
            <div
              className={cx(
                styles.createButton,
                (creating || !isValid) && styles.disabled
              )}
              onClick={isValid ? handleRegister : null}
            >
              {creating ? <ClipLoader color="#FFF" size={16} /> : 'Submit'}
            </div>
          ) : (
            <div
              className={cx(
                styles.createButton,
                (creating || deploying || !isValid) && styles.disabled
              )}
              onClick={isValid && !creating && !deploying ? handleCreate : null}
            >
              {creating ? (
                <ClipLoader color="#FFF" size={16} />
              ) : deploying ? (
                'Deploying Contract'
              ) : (
                'Create'
              )}
            </div>
          )}
        </div>
      </div>
      {renderMenu}
    </div>
  );
};

export default CollectionCreate;
