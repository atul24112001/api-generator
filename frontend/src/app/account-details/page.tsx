import apiClient from "@/apiClient/apiClient";
import AccountDetails from "@/components/accountDetails/AccountDetails";

function Account({}) {
  return (
    <main className="mt-4">
      <h4 className="text-xl">Account Details</h4>
      <AccountDetails />
    </main>
  );
}

export default Account;
