import React, {useEffect, useState} from 'react'
import {AutoColumn} from '../../components/Column'
import styled from 'styled-components'
import {STAKING_REWARDS_INFO, useStakingInfo} from '../../state/stake/hooks'
import {ExternalLink, TYPE} from '../../theme'
import PoolCard from '../../components/earn/PoolCard'
import {RowBetween} from '../../components/Row'
import {CardBGImage, CardNoise, CardSection, DataCard} from '../../components/earn/styled'
import {Countdown} from './Countdown'
import Loader from '../../components/Loader'
import {useActiveWeb3React} from '../../hooks'
import {ChainId, Currency, ETHER, JSBI, Pair, Token, TokenAmount, WETH} from "@uniswap/sdk";
import {DOV, UNI, USDT, ZERO_ADDRESS} from "../../constants";
import FakePoolCard from "../../components/earn/FakePoolCard";
import {unwrappedToken} from "../../utils/wrappedCurrency";

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const FooterLink = styled.a`
  color: #888;

  :hover, :focus, :active {
    color: #888;
  }
`

export interface CardInfo {
  currency0: Currency
  currency1: Currency
  totalDeposited: string
  poolRate: string
  periodFinish: Date | undefined
  currentAPR: string
}

export function httpGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      }
    }
    xhr.onerror = function (e) {
      reject(xhr.statusText);
    };
    xhr.send(null);
  })
}

export default function Earn() {
  const { account, chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()

  const [cardInfos, setCardInfos] = useState([
    {
      currency0: DOV[ChainId.MAINNET],
      currency1: ETHER,
      totalDeposited: 'Loading..',
      poolRate: 'Loading..',
      periodFinish: undefined,
      currentAPR: 'Loading..'
    }
  ] as CardInfo[])

  const getCardInfos = () => {
    httpGet('/api').then(dataString => {
      const data = JSON.parse(dataString)
      const newCardInfos = cardInfos.concat()

      newCardInfos[0].totalDeposited = data['DOV-ETH'].totalDeposited.toLocaleString('en', { style: 'currency', currency: 'USD' })  + ' USD'
      newCardInfos[0].poolRate = Number(data['DOV-ETH'].poolRate).toLocaleString('en') + ' DOV / week'
      newCardInfos[0].periodFinish = new Date(Number(data['DOV-ETH'].periodFinish * 1000))

      setCardInfos(newCardInfos)
    })
  }

  useEffect(() => {
    getCardInfos()

    const intervalId = setInterval(() => {
      getCardInfos()
    }, 60 * 1000)

    return () => clearInterval(intervalId)
  }, [account])

  const DataRow = styled(RowBetween)`
    ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
  `};
  `

  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Grow your crypto offset</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  This liquidity reward pool has ended. Please unstake your UNI-v2 tokens from this pool and join our new pool at liquidity-v3.dovu.earth
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://liquidity-v3.dovu.earth"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Go to the new pool at liquidity-v3.dovu.earth</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>

        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={cardInfos?.[0]?.periodFinish || stakingInfos?.[0]?.periodFinish} />
        </DataRow>
        <PoolSection>
          {!account ? (
              <>
              <FakePoolCard cardInfo={cardInfos[0]} />
              </>
          ) : (
              (!stakingInfos || stakingInfos.length === 0) ? (
                      <Loader style={{ margin: 'auto' }} />
                  ) :
            stakingInfos?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>

      <div style={{position: 'fixed', left: '0', bottom: '16px', paddingLeft: '16px', fontSize: '10px', color: '0x888'}}>
        View source code on <FooterLink href="https://github.com/dovuofficial/uniswap-interface" target="_blank">GitHub</FooterLink>. Based on <FooterLink href="https://github.com/Uniswap/uniswap-interface" target="_blank">uniswap-interface</FooterLink>.
      </div>
    </PageWrapper>
  )
}
