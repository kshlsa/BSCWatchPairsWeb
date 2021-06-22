  const ethers = require('ethers');
  const dotenv = require('dotenv').config();
  var firebase = require('firebase');
  const fs = require('firebase-admin');
  const bn = require('bn');
  
  var firebaseConfig = {
    apiKey: "-xSouR2c",
    authDomain: "twitter-clone-d74a6.firebaseapp.com",
    projectId: "twitter-clone-d74a6",
    storageBucket: "twitter-clone-d74a6.appspot.com",
    messagingSenderId: "306691374615",
    appId: "1:306691374615:web:ca58ef80e06116cde12652",
    measurementId: "G-R8JBC2FWMG"
  };
  firebase.initializeApp(firebaseConfig);
  let db = firebase.firestore();

  const addresses = {
      WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', 
      router: '0x10ed43c718714eb63d5aa57b78b54704e256024e',
      recipient: '0xd3c03d5Da35ad308FEc81018CC037c9EaBD62fa9'
    }

  const privateKey = process.env.PRIVATEKEY;
  const provider1 = process.env.PROVIDER;
  const provider = new ethers.providers.WebSocketProvider(provider1);
  const wallet = new ethers.Wallet(privateKey);  
  const account = wallet.connect(provider);
  let initialLiquidityDetected = false;
  
  const liquidityminimal = ethers.utils.formatEther(ethers.utils.parseEther('25')); //minimal liquidity 25 BNB

  const factory = new ethers.Contract(
      addresses.factory,
      ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
      account
  );
  const erc = new ethers.Contract(
    addresses.WBNB,
    [
      'function symbol() external view returns (string memory)',
      'function balanceOf(address owner) external view returns (uint)'
    ],
    account
  );  
  const router = new ethers.Contract(
    addresses.router,
    [
      'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
      'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
    ],
    account
  );

  let tokenOut;
  factory.on('PairCreated', async (token0, token1, pairAddress) => {

    if(token0 == addresses.WBNB) {
      tokenOut = token1;
    } else if (token1 == addresses.WBNB) {
      tokenOut = token0;
    } else {
      return;
    }


    const bscAddressURL = 'https://bscscan.com/address/'+tokenOut;
    const bscTokenURL = 'https://bscscan.com/token/'+tokenOut;
    const bscPairURL = 'https://bscscan.com/address/'+pairAddress;
  

    //const pair = new ethers.Contract(pairAddress, ['event Mint(address indexed sender, uint amount0, uint amount1)'], account);

    // pair.on('Mint', async (sender, amount0, amount1) => {
    //   if(initialLiquidityDetected === true) {
    //       return;
    //   }

    //   initialLiquidityDetected = true;
      const pairBNBvalue = await erc.balanceOf(pairAddress); //getting from LP not tx addliquid xd
      
      const bnbne = ethers.utils.formatEther(pairBNBvalue);
     
      

      const targetBEP = new ethers.Contract(
        tokenOut,
        [
          'function symbol() external view returns (string memory)',
          'function balanceOf(address owner) external view returns (uint)'
        ],
        account
      );  
      
      const tokenSymbol = await targetBEP.symbol();
      
      const pair = new ethers.Contract(
        pairAddress,
        [
          'function name() external pure returns (string memory)',
          'function symbol() external pure returns (string memory)',
          'function decimals() external pure returns (uint8)',
          'function totalSupply() external view returns (uint)',
          'function MINIMUM_LIQUIDITY() external pure returns (uint)',
          'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
          'function price0CumulativeLast() external view returns (uint)',
          'function price1CumulativeLast() external view returns (uint)',
          'function kLast() external view returns (uint)'
        ],
        account
      );
        
        const totalSupply = await pair.totalSupply();
        const minLiquidity = await pair.MINIMUM_LIQUIDITY();
        const reserves = await pair.getReserves();
        //const name = await pair.name();

        
        console.log(' balance '+ bnbne +' token ' + tokenSymbol +' totalsupply '+ ethers.utils.formatEther(totalSupply) +' minimum liquidity '+ ethers.utils.formatEther(minLiquidity) +' ' + bscTokenURL);
        console.log(ethers.utils.formatEther(reserves[0]) +' '+ ethers.utils.formatEther(reserves[1]));

        
      if(bnbne.sub(liquidityminimal).toNumber >= 0){

        const message = 'Pancakeswap New pair detected with over 25 BNB liquidity tokenOut: ' + bscTokenURL + ' pairAddress: '+ bscPairURL + ' ' + bnbne +' ' + bscTokenURL +' '+ tokenSymbol +' '+ totalSupply +' '+ minLiquidity +' ' + reserves;
        const tweetImage = '';
        console.log(`
          Pancakeswap New WBNB pair detected with over 25 BNB liquidity
          =================
          tokenOut:`+bscTokenURL+`
          pairAddress:`+bscPairURL+`
          liquidity BNB: `+bnbne+`
          Symbol: `+tokenSymbol+`
        `);

        const liam = await
        db.collection("posts").doc().set({
          displayName: "Kushal Sanghvi",
          username: "kushalsa",
          verified: true,
          text: message,
          image: tweetImage,
          avatar:
          "https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/themes/284832/settings_images/rLlCifhXRJiT0RoN2FjK_Logo_roundbackground_black.png"
        });
      };
    
});

 
