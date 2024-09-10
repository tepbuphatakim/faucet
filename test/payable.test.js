import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers.js';
import { expect } from 'chai';

describe('Payable', function () {
  async function deployPayableFixture() {
    const Payable = await ethers.getContractFactory('Payable');
    const [owner] = await ethers.getSigners();
    const contract = await Payable.deploy({
      value: ethers.parseEther('9'),
    });

    return { contract, owner };
  }

  it('should deploy and set the owner correctly', async function () {
    const { contract, owner } = await loadFixture(deployPayableFixture);
    expect(await contract.owner()).to.equal(owner.address);
  });

  it('should have contract balance of 9 eth', async function () {
    const { contract } = await loadFixture(deployPayableFixture);
    expect(await contract.getContractBalance()).to.equal(
      ethers.parseEther('9')
    );
  });

  it('should allow owner to withdraw with correct amount', async function () {
    const { contract, owner } = await loadFixture(deployPayableFixture);
    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);

    const withdrawAmount = ethers.parseEther('9');
    const tx = await contract.withdraw(withdrawAmount);
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed * receipt.gasPrice;

    const contractBalance = await ethers.provider.getBalance(
      await contract.getAddress()
    );
    const ownerBalance = await ethers.provider.getBalance(owner.address);

    expect(contractBalance).to.equal(0n);
    expect(ownerBalance).to.equal(
      initialOwnerBalance + withdrawAmount - gasCost
    );
  });

  it('Should not allow owner to withdraw with insufficient amount', async function () {
    const { contract } = await loadFixture(deployPayableFixture);
    const withdrawAmount = ethers.parseEther('9.1');

    await expect(contract.withdraw(withdrawAmount)).to.be.revertedWith(
      'Insufficient balance'
    );
  });

  it('Should not allow non-owners to withdraw', async function () {
    const { contract } = await loadFixture(deployPayableFixture);
    const [, otherAcc] = await ethers.getSigners();
    const withdrawAmount = ethers.parseEther('1');

    await expect(
      contract.connect(otherAcc).withdraw(withdrawAmount)
    ).to.be.revertedWith('Only the owner can withdraw Ether');
  });
});
