import { getUserPaidStatus } from "@/actions/actions";
import H1 from "@/components/h1";

export default async function Signup() {
  const isPaidUser = await getUserPaidStatus('cmkmqu1y30000zutjzw98z12d');
  return (
    <H1>Signup Page</H1>
  )
}
