# housing-dao

Notes
Kris:
Talked to Griff Green, he's gonna drop by the table area sometime this evening to chat about bonding curves, hatch functions, difference from an icon etc.

Still to do:
- [x] Talk to DAOstack about functionality
- [ ] Ask Ven about testnet and local deployments of moloch (This didn't happen as we deployed DAOstack)

# contract

Contract is deployed on Rinkeby at 0x12FC7882Fb52c73fCa405a08A3E9a681761D1fDD

- [x] set up hatch amount
- [x] prevent sells and transfers and withdrawls before hatch
- [x] route the referall to the DAO address
- [x] take operation cut for sells
- [x] take operational cut for transfers
- [ ] reuse ambassadorQuota_ for whitelisted addresses (3Box)
- [x] prevent selling and transferring of tokens before hatch 
- [x] whichever address deployed the contract will be the administrator
- [ ] allow administrator to add (or remove?) administrators
- [x] allow DAO to withdraw operational balance
- [x] provide a real DAO address

# DAO
- [x] Deploy DAOstack DAO on Alchemy
- [x] Onboard everyone as members
- [ ] Determine Whitelist capabilities using 3Box
- [ ] Determine how to tie REP to HBT holdings
- [ ] Connect to Bonded Token Contract

# Front End
- [ ] Setup static page
- [ ] Add Buy/Sell token functionality via Bonded Token Contract
- [ ] Add Visual Elements pulling data from the Graph
- [ ] 

# Presentation
- [ ] Slides file created: https://docs.google.com/presentation/d/1wGcUMHlX4AdsTCI2S7GYkgQEvLhgoEuaYi1fKzFcmAE/edit#slide=id.g7dbfb19886_0_0
- [ ] Flesh out text
- [ ] Add visual elements
- [ ] Finalize Slides

## Resources:

*Smart Contract*
https://etherscan.io/address/0xb3775fb83f7d12a36e0475abdd1fca35c091efbe#code

*Dao Creation*
https://alchemy.daostack.io/daos/create

*Front end:* 
https://github.com/odyssy-automaton/moloch-pokemol
