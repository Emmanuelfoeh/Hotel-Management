'use client';

import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { EntityType, ActionType } from '@/types';
import { getActivityLogs } from '@/actions/activity-log.actions';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import {
  ChevronDown,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityLog {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  userId: string;
  details: any;
  ipAddress: string | null;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface ActivityLogProps {
  entityType?: EntityType;
  entityId?: string;
  limit?: number;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function ActivityLog({
  entityType: filterEntityType,
  entityId: filterEntityId,
  limit,
}: ActivityLogProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Filters
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>(
    filterEntityType || 'all'
  );
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  useEffect(() => {
    loadLogs();
  }, [filterEntityType, filterEntityId]);

  useEffect(() => {
    applyFilters();
  }, [logs, entityTypeFilter, actionFilter, searchQuery, dateRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredLogs.length]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: any = {};

      if (filterEntityType) {
        filters.entityType = filterEntityType;
      }

      if (filterEntityId) {
        filters.entityId = filterEntityId;
      }

      const result = await getActivityLogs(filters);

      if (result.success && result.data) {
        setLogs(result.data as ActivityLog[]);
      } else {
        setError(result.error || 'Failed to load activity logs');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Entity type filter
    if (!filterEntityType && entityTypeFilter !== 'all') {
      filtered = filtered.filter((log) => log.entityType === entityTypeFilter);
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.user.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          log.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (log) => new Date(log.createdAt) >= dateRange.from!
      );
    }
    if (dateRange.to) {
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter((log) => new Date(log.createdAt) <= endOfDay);
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredLogs(filtered);
  };

  const toggleRowExpansion = (logId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const clearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const setQuickDateRange = (days: number) => {
    setDateRange({
      from: subDays(new Date(), days),
      to: new Date(),
    });
  };

  const getActionBadgeVariant = (action: ActionType) => {
    switch (action) {
      case 'CREATE':
        return 'default';
      case 'UPDATE':
        return 'secondary';
      case 'DELETE':
        return 'destructive';
      case 'CHECK_IN':
        return 'default';
      case 'CHECK_OUT':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEntityTypeBadgeVariant = (entityType: EntityType) => {
    switch (entityType) {
      case 'ROOM':
        return 'default';
      case 'BOOKING':
        return 'secondary';
      case 'CUSTOMER':
        return 'outline';
      case 'STAFF':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <p className="text-sm text-muted-foreground">
          {filteredLogs.length} {filteredLogs.length === 1 ? 'log' : 'logs'}{' '}
          found
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        {!filterEntityType && !filterEntityId && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search by user, email, or entity ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={entityTypeFilter}
                onValueChange={setEntityTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ROOM">Room</SelectItem>
                  <SelectItem value="BOOKING">Booking</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                  <SelectItem value="CHECK_IN">Check In</SelectItem>
                  <SelectItem value="CHECK_OUT">Check Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !dateRange.from && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                          {format(dateRange.to, 'MMM dd, yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'MMM dd, yyyy')
                      )
                    ) : (
                      'Select date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDateRange(7)}
                      >
                        Last 7 days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDateRange(30)}
                      >
                        Last 30 days
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDateRange(90)}
                      >
                        Last 90 days
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <Calendar
                      mode="range"
                      selected={{
                        from: dateRange.from,
                        to: dateRange.to,
                      }}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        });
                      }}
                      numberOfMonths={2}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {(dateRange.from || dateRange.to) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDateRange}
                  className="h-9"
                >
                  <X className="mr-1 h-4 w-4" />
                  Clear dates
                </Button>
              )}

              <div className="ml-auto">
                <Button onClick={loadLogs} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="py-8">
            <p className="text-center text-destructive">{error}</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            title="No activity logs found"
            description="There are no activity logs matching your filters."
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <>
                      <TableRow
                        key={log.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleRowExpansion(log.id)}
                      >
                        <TableCell>
                          {log.details ? (
                            expandedRows.has(log.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )
                          ) : null}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(
                            new Date(log.createdAt),
                            'MMM dd, yyyy HH:mm:ss'
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {log.user.firstName} {log.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {log.user.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getEntityTypeBadgeVariant(log.entityType)}
                          >
                            {log.entityType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.entityId.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.ipAddress || 'N/A'}
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(log.id) && log.details && (
                        <TableRow key={`${log.id}-details`}>
                          <TableCell colSpan={7} className="bg-muted/30">
                            <div className="p-4">
                              <h4 className="mb-2 font-semibold text-sm">
                                Log Details
                              </h4>
                              <pre className="overflow-auto rounded bg-background p-3 text-xs border">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to{' '}
                    {Math.min(endIndex, filteredLogs.length)} of{' '}
                    {filteredLogs.length} logs
                  </p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 / page</SelectItem>
                      <SelectItem value="20">20 / page</SelectItem>
                      <SelectItem value="50">50 / page</SelectItem>
                      <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and pages around current
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <>
                            {showEllipsis && (
                              <span
                                key={`ellipsis-${page}`}
                                className="px-2 text-muted-foreground"
                              >
                                ...
                              </span>
                            )}
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? 'default' : 'outline'
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-9"
                            >
                              {page}
                            </Button>
                          </>
                        );
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
