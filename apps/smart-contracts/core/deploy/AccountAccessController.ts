// eslint-disable no-console
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { ChainId } from 'prepo-constants'
import { utils } from 'prepo-hardhat'

const { assertIsTestnetChain } = utils

const deployFunction: DeployFunction = async function ({
  deployments,
  getNamedAccounts,
  getChainId,
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  console.log('Running AccountAccessController deploy script with', deployer, 'as the deployer')
  const currentChain = await getChainId()
  /**
   * Make sure this script is not accidentally targeted towards a production environment.
   * This can be temporarily removed if deploying to prod.
   */
  assertIsTestnetChain(currentChain as unknown as ChainId)
  const { address: accessControllerAddress, newlyDeployed } = await deploy(
    'AccountAccessController',
    {
      from: deployer,
      contract: 'AccountAccessController',
      deterministicDeployment: false,
      args: [],
      skipIfAlreadyDeployed: true,
    }
  )
  if (newlyDeployed) {
    console.log('Deployed AccountAccessController to', accessControllerAddress)
  } else {
    console.log('Existing AccountAccessController at', accessControllerAddress)
  }
  console.log('')
}

export default deployFunction

deployFunction.tags = ['AccountAccessController']
