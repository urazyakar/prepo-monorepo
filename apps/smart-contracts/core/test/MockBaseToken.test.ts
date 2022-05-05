import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address'
import { parseEther } from 'ethers/lib/utils'
import { mockBaseTokenFixture } from './fixtures/MockBaseTokenFixture'
import { AddressZero, revertReason } from './utils'
import { MockBaseToken } from '../typechain/MockBaseToken'

chai.use(solidity)

describe('=> MockBaseToken', () => {
  let mockBaseToken: MockBaseToken
  let owner: SignerWithAddress
  let mockStrategy: SignerWithAddress
  let user1: SignerWithAddress

  const setupAccounts = async (): Promise<void> => {
    ;[owner, mockStrategy, user1] = await ethers.getSigners()
  }

  const setupMockBaseToken = async (): Promise<void> => {
    mockBaseToken = await mockBaseTokenFixture()
  }

  describe('initial state', (): void => {
    before(async () => {
      await setupAccounts()
      await setupMockBaseToken()
    })

    it("sets name to 'Mock Base Token'", async () => {
      expect(await mockBaseToken.name()).to.eq('Mock Base Token')
    })

    it("sets symbol to 'MBT'", async () => {
      expect(await mockBaseToken.symbol()).to.eq('MBT')
    })

    it('sets owner to deployer', async () => {
      expect(await mockBaseToken.owner()).to.eq(owner.address)
    })
  })

  describe('# setMockStrategy', () => {
    beforeEach(async () => {
      await setupAccounts()
      await setupMockBaseToken()
    })

    it('reverts if not owner', async () => {
      expect(await mockBaseToken.owner()).to.not.eq(user1.address)

      expect(mockBaseToken.connect(user1).setMockStrategy(mockStrategy.address)).revertedWith(
        revertReason('Ownable: caller is not the owner')
      )
    })

    it('sets to non-zero address', async () => {
      expect(await mockBaseToken.getMockStrategy()).to.not.eq(mockStrategy.address)

      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)

      expect(await mockBaseToken.getMockStrategy()).to.eq(mockStrategy.address)
    })

    it('is idempotent', async () => {
      expect(await mockBaseToken.getMockStrategy()).to.not.eq(mockStrategy.address)

      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)

      expect(await mockBaseToken.getMockStrategy()).to.eq(mockStrategy.address)

      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)

      expect(await mockBaseToken.getMockStrategy()).to.eq(mockStrategy.address)
    })

    it('sets to zero address', async () => {
      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)
      expect(await mockBaseToken.getMockStrategy()).to.not.eq(AddressZero)

      await mockBaseToken.connect(owner).setMockStrategy(AddressZero)

      expect(await mockBaseToken.getMockStrategy()).to.eq(AddressZero)
    })
  })

  describe('# mint', () => {
    const testMintAmount = parseEther('1000')
    beforeEach(async () => {
      await setupAccounts()
      await setupMockBaseToken()
      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)
    })

    it('reverts if not mock strategy', async () => {
      expect(await mockBaseToken.getMockStrategy()).to.not.eq(user1.address)

      expect(mockBaseToken.connect(user1).mint(user1.address, testMintAmount)).revertedWith(
        revertReason('Caller is not MockStrategy')
      )
    })

    it('mints tokens to recipient', async () => {
      const balanceBefore = await mockBaseToken.balanceOf(user1.address)

      await mockBaseToken.connect(mockStrategy).mint(user1.address, testMintAmount)

      expect(await mockBaseToken.balanceOf(user1.address)).to.eq(balanceBefore.add(testMintAmount))
    })

    it('mints tokens to recipient if recipient is mock strategy', async () => {
      const balanceBefore = await mockBaseToken.balanceOf(mockStrategy.address)

      await mockBaseToken.connect(mockStrategy).mint(mockStrategy.address, testMintAmount)

      expect(await mockBaseToken.balanceOf(mockStrategy.address)).to.eq(
        balanceBefore.add(testMintAmount)
      )
    })
  })

  describe('# ownerMint', () => {
    const testMintAmount = parseEther('1000')
    beforeEach(async () => {
      await setupAccounts()
      await setupMockBaseToken()
      await mockBaseToken.connect(owner).setMockStrategy(mockStrategy.address)
    })

    it('reverts if not owner', async () => {
      expect(await mockBaseToken.owner()).to.not.eq(user1.address)

      expect(mockBaseToken.connect(user1).ownerMint(testMintAmount)).revertedWith(
        revertReason('Ownable: caller is not the owner')
      )
    })

    it('mints tokens to owner', async () => {
      const balanceBefore = await mockBaseToken.balanceOf(owner.address)

      await mockBaseToken.connect(owner).ownerMint(testMintAmount)

      expect(await mockBaseToken.balanceOf(owner.address)).to.eq(balanceBefore.add(testMintAmount))
    })
  })
})