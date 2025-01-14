import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { centered, spacingIncrement, Button } from 'prepo-ui'
import { Trans } from '@lingui/macro'
import Identicon from './Identicon'
import AccountModal from './AccountModal'
import WalletAddressCard from './WalletAddressCard'
import { getShortAccount } from '../../utils/account-utils'
import { useRootStore } from '../../context/RootStoreProvider'

const Wrapper = styled.div`
  border-radius: ${({ theme }): string => `${theme.borderRadius}px`};
  display: inline-flex;
`

const Flex = styled.div`
  display: flex;
`

const IconWrapper = styled.span`
  ${centered}
  margin-right: ${spacingIncrement(8)};
`

const StyledButton = styled(Button)`
  &&&& .ant-btn {
    height: ${spacingIncrement(38)};
  }
`

const ConnectButton: React.FC = () => {
  const { uiStore, web3Store } = useRootStore()
  const { signerState, onboardEns } = web3Store
  const account = signerState.address

  const onClickLogin = (): void => {
    web3Store.connect()
  }

  const onOpenModal = (): void => {
    uiStore.setAccountModalOpen(true)
  }

  return (
    <Wrapper>
      <AccountModal />
      <Flex>
        {account ? (
          <WalletAddressCard onClick={onOpenModal}>
            <IconWrapper>
              <Identicon
                account={account}
                avatarUrl={onboardEns?.avatar?.url}
                diameterDesktop={23}
                diameterMobile={23}
              />
            </IconWrapper>
            {onboardEns?.name ?? getShortAccount(account)}
          </WalletAddressCard>
        ) : (
          <StyledButton type="primary" onClick={onClickLogin} size="sm">
            <Trans>Connect Wallet</Trans>
          </StyledButton>
        )}
      </Flex>
    </Wrapper>
  )
}

export default observer(ConnectButton)
