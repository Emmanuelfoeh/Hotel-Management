import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomersTable } from '@/components/admin/tables/customers-table';
import { customerService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';

interface CustomersPageProps {
  searchParams: {
    query?: string;
  };
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  await requireAuth();

  const customers = await customerService.getCustomers({
    query: searchParams.query,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers Management</h1>
        <p className="text-muted-foreground">
          Manage customer profiles and booking history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  );
}
