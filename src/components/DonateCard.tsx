import { useEffect, useState } from "react";
import { formatAccount, formatEth, getEthBalance } from "../utils/wallet";
import useDonationBox from "../hooks/web3";
import Spinner from "./Spinner";

const DonateCard: React.FC = () => {
  const { donate, getAllDonations, isTrxPending } = useDonationBox();

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('');
  const [donateAmount, setDonateAmount] = useState<number>(0);
  const [totalDonations, setTotalDonations] = useState<string>('');
  const [isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  const [isDonationLoading, setIsDonationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    if((window as any).ethereum){
      //check if Metamask wallet is installed
      setIsMetamaskInstalled(true);
    }
  },[]);

  useEffect(() => {
    getWalletBalane();
    getTotalDonations();
  }, [account])

  const getWalletBalane = () => {
    setIsBalanceLoading(true);
    getEthBalance(account as string)
    .then((balance: string) => {
      setBalance(balance);
      setIsBalanceLoading(false);
    })
    .catch((error) => {
      console.log(error);
      alert("Cannot get wallet balance!");
    });
  }

  const getTotalDonations = () => {
    setIsDonationLoading(true);
    getAllDonations()
    .then((res) => {
      setTotalDonations(res as string);
      setIsDonationLoading(false);
    })
    .catch((error) => {
      alert("Cannot get total donation amount!");
    });
  }

  //Does the User have an Ethereum wallet/account?
  async function connectMetamaskWallet(): Promise<void> {
    if (!isMetamaskInstalled) {
      alert("Please install Metamask wallet!");
      return;
    }

    if (!account) {
      //to get around type checking
      (window as any).ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts : string[]) => {
          setAccount(accounts[0]);
        })
        .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
        });
    } else {
      setAccount(null);
    }
  }

  const onClickDonate = () => {
    donate(donateAmount).then(() => {
      getWalletBalane();
      getTotalDonations();
    });
  }

  const onChangeDonateAmount = (e: any) => {
    const value = e.target.value;
    if (/^([0-9]{1,})?(\.)?([0-9]{1,})?$/.test(value))
      setDonateAmount(value);
    setError('');
    if (parseFloat(value as string) > parseFloat(balance as string))
      setError("Your input amount exceeds the balance.");
    if (!value)
      setError("Please input donate amount.");
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex flex-col items-center justify-center rounded-md border border-gray-300 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-100">
        <button className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-48 rounded-full" onClick={connectMetamaskWallet}>
          <span>{formatAccount(account as string) || "Connect Wallet"}</span>
        </button>
        {
          !!account && (
            <>
              <span className="text-2xl text-gray-700 mt-8">
                {isBalanceLoading ?
                  (
                    <div className="flex items-center">
                      <span className="mr-8">Wallet Balance:</span>
                      <Spinner />
                    </div>
                  ) : `Wallet Balance: ${formatEth(balance)} ETH`}
              </span>
              <span className="text-2xl text-gray-700 mt-4">
                {isDonationLoading ?
                  (
                    <div className="flex items-center">
                      <span className="mr-8">Total Donation:</span>
                      <Spinner />
                    </div>
                  ) : `Total Donation: ${formatEth(totalDonations)} ETH`}
              </span>
              <div className="mt-4">
                <label className={!!error ? "block mb-1 text-sm font-medium text-red-700 dark:text-red-500" : "block mb-1 text-sm font-medium text-gray-700 dark:text-gray-700"}>Donate Amount</label>
                <input
                  type="text"
                  className={
                    !!error ? 
                      "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-100 focus:border-red-500 block w-72 p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                      : "bg-gray-50 border border-gray-500 text-gray-900 placeholder-gray-700 text-sm rounded-lg focus:ring-gray-500 dark:bg-gray-100 focus:border-gray-500 block w-72 p-2.5 dark:text-gray-500 dark:placeholder-gray-500 dark:border-gray-500"
                    }
                  placeholder="input donate amount"
                  value={donateAmount}
                  onChange={onChangeDonateAmount}
                />
                <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
              </div>
              <button className={`text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 mt-4 w-auto ${isTrxPending ? "cursor-not-allowed" : ""}`} disabled={isTrxPending} onClick={onClickDonate}>
                <span>{isTrxPending ? (<div className="flex"><Spinner /><span className="flex items-center ml-1">Transaction Pending</span></div>) : "Donate"}</span>
              </button>
            </>
          )
        }
      </div>
    </div>
  );
}

export default DonateCard;