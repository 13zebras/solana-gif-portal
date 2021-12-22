import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

// Constants
const TWITTER_HANDLE = "tom13zebras";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const AFI_LINK = 'https://www.afi.com/afis-100-years-100-movies-10th-anniversary-edition/';

const TEST_GIFS = [
	'https://media.giphy.com/media/xTdAjr0aZ8PcSAGTqE/giphy.gif',
	'https://media.giphy.com/media/l41Yzjtm0YbybMLHG/giphy.gif',
	'https://media.giphy.com/media/10zrR4UzeWa3ja/giphy.gif',
	'https://media.giphy.com/media/W28xDHXzmkRva2Affn/giphy.gif',
	'https://media.giphy.com/media/25IFTnS61JZ0A/giphy.gif',
	'https://media.giphy.com/media/aq6wETurhpbc4/giphy.gif',
	'https://media.giphy.com/media/26FxJ7t3oj5FEQE7K/giphy.gif',
	'https://media.giphy.com/media/8cPKoUD4RjlP9c1hWI/giphy.gif'
];
const App = () => {
    // state
    const [walletAddress, setWalletAddress] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [gifList, setGifList] = useState([]);

    // actions
    const checkIfWalletIsConnected = async () => {
        try {
            const { solana } = window;

            if (solana) {
                if (solana.isPhantom) {
                    console.log("Phantom wallet found!");
                    const response = await solana.connect({
                        onlyIfTrusted: true,
                    });
                    console.log(
                        "Connected with Public Key:",
                        response.publicKey.toString()
                    );
                    setWalletAddress(response.publicKey.toString());
                }
            } else {
                alert("Solana object not found! Get a Phantom Wallet 👻");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        const { solana } = window;

        if (solana) {
            const response = await solana.connect();
            console.log(
                "Connected with Public Key:",
                response.publicKey.toString()
            );
            setWalletAddress(response.publicKey.toString());
        }
    };

	const onInputChange = (event) => {
		const { value } = event.target;
		setInputValue(value);
	};

	const sendGif = async () => {
		if (inputValue.length > 0) {
			console.log('Gif link:', inputValue);
		} else {
			console.log('Empty input. Try again.');
		}
	};

    const renderNotConnectedContainer = () => (
        <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
        >
            Connect to Your Wallet
        </button>
    );

	const renderConnectedContainer = () => (
		<div className="connected-container">
			<form onSubmit={(event) => {
      			event.preventDefault();
				sendGif();
     			}}
    		>
      			<input type="text" placeholder="Enter gif link!" value={inputValue} onChange={onInputChange} />
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
        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

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
            <div className={walletAddress ? "authed-container" : "container"}>
                <div className="header-container">
                    <p className="header">AFI'S 100 YEARS...100 MOVIES</p>
                    <p className="sub-text">
                        The Metaverse ✨ goes to the movies!
                    </p>
                    {/* Render your connect to wallet button right here */}
                    {!walletAddress && renderNotConnectedContainer()}
					{walletAddress && renderConnectedContainer()}
                </div>
                <div className="footer-container">
                    <img
                        alt="Twitter Logo"
                        className="twitter-logo"
                        src={twitterLogo}
                    />
                    <a
                        className="footer-text"
                        href={TWITTER_LINK}
                        target="_blank"
                        rel="noreferrer"
                    >{`built by @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
