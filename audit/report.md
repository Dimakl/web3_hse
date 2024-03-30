<!-- Your report starts here! -->

Lead Auditors:

- Kocheshkov Dmitrii dmitriiKocheshkov@yandex.ru

# Table of Contents

- [Table of Contents](#table-of-contents)
- [Protocol Summary](#protocol-summary)
- [Disclaimer](#disclaimer)
- [Risk Classification](#risk-classification)
- [Audit Details](#audit-details)
  - [Scope](#scope)
- [Executive Summary](#executive-summary)
  - [Issues found](#issues-found)
- [Findings](#findings)
- [High](#high)
- [Medium](#medium)
- [Low](#low)
- [Informational](#informational)
- [Gas](#gas)

# Protocol Summary

Given smart-contract is a lottery with NFT-kittens.

# Disclaimer

The HSE team makes all effort to find as many vulnerabilities in the code in the given time period, but holds no responsibilities for the findings provided in this document. A security audit by the team is not an endorsement of the underlying business or product. The audit was time-boxed and the review of the code was solely on the security aspects of the Solidity implementation of the contracts.

# Risk Classification

|            |        | Impact |        |     |
| ---------- | ------ | ------ | ------ | --- |
|            |        | High   | Medium | Low |
|            | High   | H      | H/M    | M   |
| Likelihood | Medium | H/M    | M      | M/L |
|            | Low    | M      | M/L    | L   |

We use the [CodeHawks](https://docs.codehawks.com/hawks-auditors/how-to-evaluate-a-finding-severity) severity matrix to determine severity. See the documentation for more details.

All vulnerabilities discovered during the audit are classified based on their potential severity and have the following classification:

| Severity | Description                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | Bugs leading to assets theft, fund access locking, or any other loss of funds and bugs that can trigger a contract failure. Further recovery is possible only by manual modification of the contract state or replacement. |
| Medium   | Bugs that can break the intended contract logic or expose it to DoS attacks, but do not cause direct loss funds.                                                                                                           |
| Low      | Bugs that do not have a significant immediate impact and could be easily fixed.                                                                                                                                            |
| Gas      | Bugs that are tied to unnecessary wasted gas.                                                                                                                                                                              |

# Audit Details

## Scope

- KittenRaffle.sol

# Executive Summary

## Issues found

| Severity | # of Findings |
| -------- | ------------- |
| HIGH     |       1        |
| MEDIUM   |        0       |
| LOW      |      2         |
| GAS      |      1         |

# Findings



# High

### Exploitable pseudo-random

### Description
Code that used for selecting winner  (and kitten quality, but its not as important) in function `selectWinner()` is dependent on sender address, block timestamp and difficulty:
```
uint256 winnerIndex = uint256(
            keccak256(
                abi.encodePacked(msg.sender, block.timestamp, block.difficulty)
            )
```
Such insafe implementation of random can be used to influence results of the winner selection.
### Recommendation
It is better to use an external oracle for getting a random output. For example Chainlink VRF can be used.



# Medium
# Low

### Theoretically endless length or players list
### Description
Theoreticaly malitious attack could be to enter the lottery *a lot* and after that the size of `players` list and getting it too big can make gas costs for all operations to big and potentially (but very unlikely) to cause our smart-contract failure. 
### Recommendation
There should be added maximum size constant for the `players` list and when there are competitors added it should be checked if size of `players` is still not very big.


### Potential integer overflow
### Description
If `totalAmountCollected ` would exceed unint256 all our prize pool calculations would be incorrect.
### Recommendation
Safe multiplication such as this can be added:
```
function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
        return 0;
    }
    uint256 c = a * b;
    require(c / a == b, "Safe multiplication overflow");
    return c;
}
```
And in case of overflow we can at least make some manual modifications to the contract. (Vunerability is not counted as high severity because of its improbability).


# Gas
### Nested loop instead of mapping

### Description
In function `enterRaffle()` nested loop is used:
```
// Проверка на дубликаты
        for (uint256 i = 0; i < players.length - 1; i++) {
            for (uint256 j = i + 1; j < players.length; j++) {
                require(
                    players[i] != players[j],
                    "KittenRaffle: Дублирующийся игрок"
                );
            }
        }
```
Such code can lead to more gas consumption.
### Recommendation
We can add mapping instead of nested cycle, for example:
```
mapping(address => bool) private isPlayer;
<...>
 for (uint256 i = 0; i < newPlayers.length; i++) {
        address player = newPlayers[i];
        require(!isPlayer[player], "KittenRaffle: Дублирующийся игрок");
        isPlayer[player] = true;
        players.push(player);
    }
```