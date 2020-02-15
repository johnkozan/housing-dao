# housing-dao

Notes
Kris:
Talked to Griff Green, he's gonna drop by the table area sometime this evening to chat about bonding curves, hatch functions, difference from an icon etc.

Still to do:
- [ ] Talk to DAOstack about functionality
- [ ] Ask Ven about testnet and local deployments of moloch

# contract

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

## Resources:

*Smart Contract*
https://etherscan.io/address/0xb3775fb83f7d12a36e0475abdd1fca35c091efbe#code

*Dao Creation*
https://alchemy.daostack.io/daos/create

*Front end:* 
https://github.com/odyssy-automaton/moloch-pokemol
