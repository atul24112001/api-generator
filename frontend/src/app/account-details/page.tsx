import apiClient from "@/apiClient/apiClient";
import AccountDetails from "@/components/accountDetails/AccountDetails";
import { cookies } from "next/headers";

async function Account({}) {
  let accountDetails = null;
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  try {
    const { data } = await apiClient.get(
      `${process.env.API_URL}/api/account-details`,
      {
        headers: {
          Authorization: `Bearer ${token?.value}`,
        },
      }
    );

    accountDetails = data.data[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return (
    <main className="mt-4">
      <h4 className="text-xl">Account Details</h4>
      <AccountDetails accountDetails={accountDetails} />
    </main>
  );
}

export default Account;
