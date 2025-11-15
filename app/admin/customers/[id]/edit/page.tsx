import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { customerService } from '@/lib/services';
import { requireAuth } from '@/lib/utils/auth-helpers';
import Link from 'next/link';
import { CustomerForm } from '@/components/admin/forms/customer-form';

async function getCustomer(id: string) {
  const customer = await customerService.getCustomerById(id);
  if (!customer) {
    notFound();
  }
  return customer;
}

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAuth();

  const { id } = await params;
  const customer = await getCustomer(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground">
            Update customer information for {customer.firstName}{' '}
            {customer.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/customers/${customer.id}`}>Cancel</Link>
          </Button>
        </div>
      </div>

      {/* Form */}
      <CustomerForm customer={customer} />
    </div>
  );
}
