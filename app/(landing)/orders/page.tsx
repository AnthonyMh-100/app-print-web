import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMyOrders } from "@/actions/action-orders";
import { UserOrders } from "@/components/orders/user-orders";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const params = await searchParams;
  const page = Number(params.page);

  const data = await getMyOrders({
    search: typeof params.q === "string" ? params.q : undefined,
    page: Number.isInteger(page) && page > 0 ? page : undefined,
    dateFrom: typeof params.from === "string" ? params.from : undefined,
    dateTo: typeof params.to === "string" ? params.to : undefined,
  });

  if (!data) redirect("/");

  return <UserOrders {...data} />;
}