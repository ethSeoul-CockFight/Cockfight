# Cockfight's Contracts

### 😎 Core Concept Flow:

- Users stake their Tokens in the CockFight Vault  
  👉🏻 Users receive chicken NFT.
- Users receive a distribution of Yield proportional to their staked amount  
  👉🏻 Users grow their Chickens and receive Egg Points.
- Users can bet their Eggs to participate in games, and the winner takes all the Eggs.
- Users can collect Eggs to hatch them into Chickens  
  👉🏻 The user's Yield is restaked.
- Users can sell their Chickens to the Protocol in exchange for tokens  
  👉🏻 Unstaking funds from the CockFight Vault.

### 📌 Addresses

**Celo**
|Contracts|Address|
|---|---|
|ChickenNFT|0xD85Cd1c7FC69d5a42aA41Ed3D61c0AAEe712b810|
|CockfightVault|0x2e8e1E3a095A823A541b2B0C699951c4CaAa3a74|
|Lottery|0x53B4b8be0334Fd896D4beb670051ab66AC874F76|

**klaytn baobab**
|Contracts|Address|
|---|---|
|ChickenNFT|0x861455da34a78ebdf1e8362c186833a7d7857376|
|CockfightVault|0x76FABC14EC01DcD0Cf8E5119f26AA4b7f24c91eE|
|Lottery|0x28323d59965A389d27f1e0C7E6e970ff1521b060|

**fhenix**
|Contracts|Address|
|---|---|
|ChickenNFT|0x861455DA34a78EBdf1E8362c186833A7D7857376|
|CockfightVault|0x86C413143B81f5DcF0db2474B28A8ab27651134C|
|Lottery|0x0645CAb4F544F450A8b653Ac2Bf32f40f9FBC08E|

**neon**
|Contracts|Address|
|---|---|
|ChickenNFT|0x861455DA34a78EBdf1E8362c186833A7D7857376|
|CockfightVault|0x76FABC14EC01DcD0Cf8E5119f26AA4b7f24c91eE|
|Lottery|0x7746517E588e3b19d398e3C5b21777c8EE00575c|

### ⚒️ Contract Architecture

```
.
├── contracts
│   ├── ChickenContract.sol
│   ├── CockfightVault.sol
│   ├── ERC165
│   │   └── ERC165.sol
│   ├── ERC20
│   │   └── ERC20.sol
│   ├── ERC5484
│   │   └── ERC5484.sol
│   ├── ERC721
│   │   ├── ERC721.sol
│   │   └── ERC721Enumerable.sol
│   ├── ERC721A.sol
│   ├── EggContract.sol
│   ├── Lottery.sol
│   ├── MockERC20.sol
│   ├── PriceContract.sol
│   ├── access
│   │   └── Ownable.sol
│   ├── interfaces
│   │   ├── IChickenContract.sol
│   │   ├── ICockfightVault.sol
│   │   ├── IERC165.sol
│   │   ├── IERC20.sol
│   │   ├── IERC20Metadata.sol
│   │   ├── IERC5484.sol
│   │   ├── IERC721.sol
│   │   ├── IERC721Enumerable.sol
│   │   ├── IERC721Metadata.sol
│   │   ├── IERC721Receiver.sol
│   │   ├── IEggContract.sol
│   │   ├── IOracle.sol
│   │   ├── IPriceContract.sol
│   │   └── draft-IERC6093.sol
│   └── utils
│       ├── Context.sol
│       ├── Strings.sol
│       └── math
│           ├── Math.sol
└──         └── SignedMath.sol
```

### 📖 Cockfight's main contracts description

1. ChickenContract.sol  
   It is cockfight's chicken NFT contract.  
   This contract inherits ERC721Enumerable contract, so all chicken's is non fungible.  
   If user deposit into our vault, user can get 1 chicken NFT.
2. EggContract.sol  
   It is our yield wrapped token.
   If user deposit into our vault, we stake user's staked principal.  
   And vault claims staking yield regulary, and distribution this yield using egg token.
3. CockfightVault.sol  
   User can deposit tokens, and withdraw their chicken NFTs.  
   We introduced a instant-egg yield system, so when user deposits thier tokens, user can get egg tokens immediately.
   Instead, users will have their NFTs locked up for the period they receive the instant yields.
4. Lottery.sol
   Users can bet their Eggs to participate in Lottery game.  
   The winner takes all the Eggs.
