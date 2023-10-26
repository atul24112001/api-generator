import Plans from "@/components/pricing/plans";

async function Pricing({}) {
  return (
    <main className="">
      <h3 className="font-bold text-center my-4 text-2xl">
        {" "}
        Subscription Plans
      </h3>
      <Plans />
    </main>
  );
}

export default Pricing;
