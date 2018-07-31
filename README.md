# Contracts for Clovers.network

## https://clovers.network/

## test

```
$ yarn test

// hopefully you get:

  Contract: Clovers
        Deploy clovers - 4693680
                $16.90 @ 8 GWE & 450/USD
                $42.24 @ 20 GWE & 450/USD
        Deploy cloversMetadata - 400342
                $1.44 @ 8 GWE & 450/USD
                $3.60 @ 20 GWE & 450/USD
        Update clovers - 44006
                $0.16 @ 8 GWE & 450/USD
                $0.40 @ 20 GWE & 450/USD
        Deploy clubToken - 2877487
                $10.36 @ 8 GWE & 450/USD
                $25.90 @ 20 GWE & 450/USD
        Deploy reversi - 1799256
                $6.48 @ 8 GWE & 450/USD
                $16.19 @ 20 GWE & 450/USD
        Deploy clubTokenController - 5272877
                $18.98 @ 8 GWE & 450/USD
                $47.46 @ 20 GWE & 450/USD
        Deploy cloversController - 6503666
                $23.41 @ 8 GWE & 450/USD
                $58.53 @ 20 GWE & 450/USD
        clovers.updateCloversControllerAddress - 74556
                $0.27 @ 8 GWE & 450/USD
                $0.67 @ 20 GWE & 450/USD
        clubToken.updateCloversControllerAddress - 43816
                $0.16 @ 8 GWE & 450/USD
                $0.39 @ 20 GWE & 450/USD
        clubToken.updateClubTokenControllerAddress - 43926
                $0.16 @ 8 GWE & 450/USD
                $0.40 @ 20 GWE & 450/USD
        cloversController.updateStakeAmount - 42947
                $0.15 @ 8 GWE & 450/USD
                $0.39 @ 20 GWE & 450/USD
        cloversController.updateStakePeriod - 42295
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        cloversController.updatePayMultipier - 42427
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        cloversController.updatePriceMultipier - 42559
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        cloversController.updateBasePrice - 43187
                $0.16 @ 8 GWE & 450/USD
                $0.39 @ 20 GWE & 450/USD
        clubTokenController.updateReserveRatio - 42614
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        clubTokenController.updateVirtualSupply - 42435
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        clubTokenController.updateVirtualBalance - 42677
                $0.15 @ 8 GWE & 450/USD
                $0.38 @ 20 GWE & 450/USD
        22,094,753 - Total Gas
                $79.54 @ 8 GWE & 450/USD
                $198.85 @ 20 GWE & 450/USD
    Clovers.sol
      ✓ should be able to read metadata (115ms)
    ClubTokenController.sol
      ✓ should read parameters that were set (96ms)
        clubTokenController.buy - 105851
                $0.38 @ 8 GWE & 450/USD
                $0.95 @ 20 GWE & 450/USD
      ✓ should mint new tokens (299ms)
        clubTokenController.sell - 36430
                $0.13 @ 8 GWE & 450/USD
                $0.33 @ 20 GWE & 450/USD
      ✓ should sell the new tokens (673ms)
    CloversController.sol
      ✓ should convert correctly (4822ms)
      ✓ should read parameters that were set (110ms)
      ✓ should make sure token doesn't exist (220ms)
        cloversController.claimClover - 362446
                $1.30 @ 8 GWE & 450/USD
                $3.26 @ 20 GWE & 450/USD
      ✓ should make sure claimClover (_keep = false) is successful using valid game w/ invalid symmetries (235ms)
      ✓ should make sure stake amount was removed from your account (161ms)
      ✓ should make sure it's not verified yet
        challengeClover gasEstimate 2030758
                $7.31 @ 8 GWE & 450/USD
                $18.28 @ 20 GWE & 450/USD
      ✓ should check the cost of challenging this clover w invalid symmetries (4512ms)
        cloversController.updateStakeAmount - 28011
                $0.10 @ 8 GWE & 450/USD
                $0.25 @ 20 GWE & 450/USD
      ✓ should update the stake amount with the gas Estimate from challengeClover (55ms)
      ✓ should check the stake amount for the token in question (56ms)
      ✓ should make sure it is verified after blocks increase (224ms)
        cloversController.retrieveStake - 225880
                $0.81 @ 8 GWE & 450/USD
                $2.03 @ 20 GWE & 450/USD
      ✓ should make sure retrieveStake tx was successful (212ms)
      ✓ should make sure token exists & is owned by this clovers contract
      ✓ should make sure reward was received
      ✓ should make sure stake amount was retured to your account (358ms)

  Contract: Reversi
    Reversi.sol
        reversiMock.logGame - 2031982
                $7.32 @ 8 GWE & 450/USD
                $18.29 @ 20 GWE & 450/USD
      ✓ should get cost to play a game (5093ms)
      ✓ should play a valid game without error (4388ms)
      ✓ should play a valid game with empty squares without error (4597ms)
      ✓ should fail when plaing empty moves game
      ✓ should fail when plaing game where last move is invalid (3318ms)


  23 passing (34s)

✨  Done in 77.08s.
```
