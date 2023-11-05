import HomeComponent from "@/components/home/HomeComponent";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  let finalData: any;
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (token?.value) {
      const { data } = await axios.get(`${process.env.API_URL}/api/project`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      finalData = data.data;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }

  return <HomeComponent finalData={finalData} />;
}
