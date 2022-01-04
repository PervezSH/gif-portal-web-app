import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
	'https://media0.giphy.com/media/l378BzHA5FwWFXVSg/200w.webp?cid=ecf05e47rn4mdjh028xsgtpant7pzgc7ar2h01biteacsuar&rid=200w.webp&ct=g',
	'https://media3.giphy.com/media/gk3R16JhLP8RUka2nD/200w.webp?cid=ecf05e47rn4mdjh028xsgtpant7pzgc7ar2h01biteacsuar&rid=200w.webp&ct=g',
	'https://media0.giphy.com/media/9zXWAIcr6jycE/200.webp?cid=ecf05e47rn4mdjh028xsgtpant7pzgc7ar2h01biteacsuar&rid=200.webp&ct=g',
	'https://media1.giphy.com/media/cODrlNTkGnZGVtVagd/200w.webp?cid=ecf05e47rn4mdjh028xsgtpant7pzgc7ar2h01biteacsuar&rid=200w.webp&ct=g'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Check if Phantom wallet is connected or not
  const checkIfWalletIsConnected = async () => {
    try {
      // First make sure we have access to window.solana
      // MetaMask automatically injects an special object named solana
      const { solana } = window;

      if (solana.isPhantom) {
        console.log('Phantom wallet found!');

        // Connect the users wallet if we're authorized to acess user's wallet
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Connect to wallet
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // Send Gif to Solana Program
  const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};

  // Fires off as user type in input box
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  // Render button if user hasn't connect wallet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // Render gif collection if wallet is connected
  const renderConnectedContainer = () => (
  <div className="connected-container">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
      <input
        type="text"
        placeholder="Enter gif link!"
        value={inputValue}
        onChange={onInputChange}
      />
      <button type="submit" className="cta-button submit-gif-button">Submit</button>
    </form>
    <div className="gif-grid">
      {gifList.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Fetch GIFs from Solana program
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header"><span className="emoji">🖼️</span> Rick and Morty GIF Portal</p>
          <p className="sub-text">
            View your Rick and Morty GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
